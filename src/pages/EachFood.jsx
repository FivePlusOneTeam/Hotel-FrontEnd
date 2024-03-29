import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import {
	Button,
	CssBaseline,
	TextField,
	Grid,
	Box,
	Container,
	Fab,
	Typography,
} from "@mui/material";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";

// services
import { useAuth } from "../context/AuthContext";
import User from "../services/user";
import Food from "../services/food";
import Comment from "../services/comment";

// components
import CommentList from "../components/commentList";
import ReserveFoodDialog from "../components/ReserveFoodDialog";
import Loading from "../components/utils/Loading";
import DeleteDialog from "../components/DeleteDialog";

// form validation
const validationSchema = Yup.object({
	name: Yup.string().required("نام غذا را وارد کنید"),
	price: Yup.number()
		.required("قیمت را وارد کنید")
		.positive("قیمت باید عدد مثبت باشد"),
	description: Yup.string().required("توضیحات را وارد کنید"),
});

const Eachfood = () => {
	const fileInputRef = useRef(null);
	const { id } = useParams();
	const [food, setFood] = useState([]);
	const { accessToken } = useAuth();
	const [image, setImage] = useState(null);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState({});
	const [isEditMode, setIsEditMode] = useState(false);
	const [isCommentListOpen, setCommentListOpen] = useState(false);
	const [openReserveDialog, setOpenReserveDialog] = useState(false);
	const [commentLoading, setCommentLoadig] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	const Navigate = useNavigate();

	const handleImageClick = () => {
		fileInputRef.current.click();
	};
	const handleFileChange = async (event) => {
		const file = event.target.files[0];
		if (file) {
			try {
				const res = await Food.uploadImage({
					uid: food.id,
					file: file,
					authToken: accessToken,
				});
				console.log(res);
				setImage(res.data.data);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleReserveBTN = () => {
		setOpenReserveDialog(true);
	};
	const handleClose = () => {
		setOpenReserveDialog(false);
		setOpenDeleteDialog(false);
	};
	const toggleCommentList = () => {
		setCommentListOpen(!isCommentListOpen);
	};

	useEffect(() => {
		const fetchData = async () => {
			if (accessToken) {
				try {
					setLoading(true);
					const userRes = await User.getOne({ accessToken: accessToken });
					const foodRes = await Food.getOne({
						uid: id,
						authToken: accessToken,
					});
					setUser(userRes.data);
					setFood(foodRes.data);
					console.log(food);
					setImage(foodRes.data.image);
					setLoading(false);
				} catch (error) {
					alert("خطایی رخ داد لطفا دوباره تلاش کنید");
					setLoading(false);
				}
			}
		};
		fetchData();
	}, [accessToken]);

	const sendComment = async (comment) => {
		setCommentLoadig(true);
		try {
			const data = {
				text: comment,
				food_id: id,
				user_id: user.id,
				rating: 5,
			};
			const res = await Comment.addFood({ data: data, authToken: accessToken });
			console.log(res);
			const foodRes = await Food.getOne({
				uid: id,
				authToken: accessToken,
			});
			setFood(foodRes.data);
		} catch (error) {
			alert(error);
		}
		setCommentLoadig(false);
	};
	const editComment = async ({ comment_id, text }) => {
		setCommentLoadig(true);
		try {
			const data = {
				text: text,
				rating: 5,
			};
			const res = await Comment.update({
				uid: comment_id,
				data: data,
				authToken: accessToken,
			});
			console.log(res);
			const foodRes = await Food.getOne({
				uid: id,
				authToken: accessToken,
			});
			setFood(foodRes.data);
		} catch (error) {
			console.log(error);
		}
		setCommentLoadig(false);
	};

	const deleteComment = async (comment_id) => {
		setCommentLoadig(true);
		try {
			const res = await Comment.delete({
				uid: comment_id,
				authToken: accessToken,
			});
			console.log(res);
			const foodRes = await Food.getOne({
				uid: id,
				authToken: accessToken,
			});
			setFood(foodRes.data);
		} catch (error) {
			console.log(error);
		}
		setCommentLoadig(false);
	};

	const handleUpdate = async (values) => {
		try {
			const data = {
				...values,
				day: food.day,
				date: food.date,
			};
			const res = await Food.edit({
				uid: id,
				authToken: accessToken,
				data: data,
			});
			setFood(res.data);
			setIsEditMode(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleDelete = async () => {
		try {
			await Food.delete({ uid: id, authToken: accessToken });
			alert("حذف با موفقیت انجام شد.");
			Navigate("/dashboard");
		} catch (error) {
			alert(error.message);
		}
	};

	if (!loading) {
		return (
			<Grid
				container
				component="main"
				sx={{ height: "100vh", backgroundColor: "#141A20" }}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
						backgroundImage: `url(${image})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}>
					<CommentList
						sendComment={sendComment}
						editComment={editComment}
						deleteComment={deleteComment}
						comments={food.comments}
						isOpen={isCommentListOpen}
						onClose={toggleCommentList}
						isLoading={commentLoading}
					/>
				</Grid>
				{!isEditMode ? (
					<Grid
						item
						xs={12}
						sm={8}
						md={5}
						elevation={6}
						square>
						<Fab
							onClick={() => toggleCommentList()}
							variant="extended"
							style={{
								position: "fixed",
								margin: "16px",
							}}>
							<Typography variant="h6">مشاهده نظرات</Typography>
							<CommentOutlinedIcon sx={{ ml: 1 }} />
						</Fab>
						<Container maxWidth="xs">
							<CssBaseline />
							<Box
								sx={{
									marginTop: 19,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
								}}>
								<Grid
									container
									spacing={1}
									item>
									<Grid
										item
										xs={12}
										mb={2}>
										<TextField
											disabled
											fullWidth
											label="نام غذا"
											defaultValue={food.name}
										/>
									</Grid>
									<Grid
										item
										mb={2}
										xs={12}>
										<TextField
											disabled
											fullWidth
											label="قیمت"
											defaultValue={food.price + " تومان"}
										/>
									</Grid>
									<Grid
										item
										mb={2}
										xs={12}>
										<TextField
											multiline
											rows={6}
											disabled
											fullWidth
											label="توضیحات"
											defaultValue={food.description}
										/>
									</Grid>
								</Grid>
								<Button
									onClick={handleReserveBTN}
									fullWidth
									variant="contained"
									sx={{
										"&:hover": {
											backgroundColor: "#b272b8",
										},
										mt: 2,
										borderRadius: 15,
										bgcolor: "secondary.main",
									}}>
									<Typography variant="h6">سفارش غذا</Typography>
								</Button>
								{user.role !== "u" && (
									<>
										<Button
											onClick={() => setIsEditMode(true)}
											fullWidth
											variant="contained"
											sx={{
												"&:hover": {
													backgroundColor: "#c98e4b",
												},
												mt: 2,
												borderRadius: 15,
												bgcolor: "#f7b060",
											}}>
											<Typography variant="h6">ویرایش اطلاعات</Typography>
										</Button>
										<Button
											onClick={() => {
												setOpenDeleteDialog(true);
											}}
											fullWidth
											variant="contained"
											sx={{
												"&:hover": {
													backgroundColor: "#c74e4e",
												},
												mt: 2,
												borderRadius: 15,
												bgcolor: "#f76d6d",
											}}>
											<Typography variant="h6">حذف غذا</Typography>
										</Button>
									</>
								)}
								<Button
									onClick={() => Navigate("/dashboard")}
									fullWidth
									variant="contained"
									sx={{
										"&:hover": {
											backgroundColor: "#5981a8",
										},
										mt: 2,
										mb: 2,
										borderRadius: 15,
										bgcolor: "#78abde",
									}}>
									<Typography variant="h6">بازگشت به داشبورد</Typography>
								</Button>
							</Box>
						</Container>
						{openReserveDialog && (
							<ReserveFoodDialog
								open={openReserveDialog}
								handleClose={handleClose}
								food_id={food.id}
								accessToken={accessToken}
							/>
						)}
						{openDeleteDialog && (
							<DeleteDialog
								handleClose={handleClose}
								title={`${food.name}`}
								handleDelete={handleDelete}
								open={openDeleteDialog}
							/>
						)}
					</Grid>
				) : (
					// Edit mood:
					<Grid
						item
						xs={12}
						sm={8}
						md={5}
						elevation={6}
						square>
						<Container maxWidth="xs">
							<CssBaseline />

							<Box
								sx={{
									marginTop: 19,
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
								}}>
								<Grid>
									<input
										type="file"
										accept="image/*"
										style={{ display: "none" }}
										ref={fileInputRef}
										onChange={handleFileChange}
									/>
									<Button
										variant="contained"
										sx={{
											"&:hover": {
												backgroundColor: "#ffffff",
											},
											borderRadius: 3,
											bgcolor: "#ebe6e6",
											mb: 3,
											textTransform: "none",
										}}
										onClick={handleImageClick}>
										<Typography variant="h6">ویرایش تصویر</Typography>
									</Button>
								</Grid>
								<Formik
									initialValues={{
										name: food.name || "",
										price: food.price || "",
										description: food.description || "",
										meal: food.meal || "d",
									}}
									validationSchema={validationSchema}
									onSubmit={handleUpdate}>
									{({ values, errors, touched, handleChange, handleBlur }) => (
										<Form>
											<Grid
												item
												container
												spacing={2}>
												<Grid
													mt={1}
													item
													xs={12}>
													<TextField
														fullWidth
														label="نام غذا"
														name="name"
														value={values.name}
														onChange={handleChange}
														onBlur={handleBlur}
														error={touched.name && Boolean(errors.name)}
														helperText={touched.name && errors.name}
													/>
												</Grid>
												<Grid
													mt={1}
													item
													xs={12}>
													<TextField
														fullWidth
														label="قیمت"
														name="price"
														type="number"
														value={values.price}
														onChange={handleChange}
														onBlur={handleBlur}
														error={touched.price && Boolean(errors.price)}
														helperText={touched.price && errors.price}
													/>
												</Grid>
												<Grid
													mt={1}
													item
													xs={12}>
													<TextField
														multiline
														rows={6}
														fullWidth
														label="توضیحات"
														name="description"
														value={values.description}
														onChange={handleChange}
														onBlur={handleBlur}
														error={
															touched.description && Boolean(errors.description)
														}
														helperText={
															touched.description && errors.description
														}
													/>
												</Grid>
											</Grid>
											<Button
												type="submit"
												fullWidth
												variant="contained"
												sx={{
													"&:hover": {
														backgroundColor: "#5cab70",
													},
													mt: 3,
													borderRadius: 15,
													bgcolor: "#7ed695",
												}}>
												<Typography variant="h6">ذخیره تغییرات</Typography>
											</Button>
											<Button
												onClick={() => setIsEditMode(false)}
												fullWidth
												variant="contained"
												sx={{
													"&:hover": {
														backgroundColor: "#c74e4e",
													},
													mt: 2,
													mb: 2,
													borderRadius: 15,
													bgcolor: "#f76d6d",
												}}>
												<Typography variant="h6">بازگشت</Typography>
											</Button>
										</Form>
									)}
								</Formik>
							</Box>
						</Container>
					</Grid>
				)}
			</Grid>
		);
	} else {
		return <Loading />;
	}
};

export default Eachfood;
