import React, { useEffect, useState } from "react";
import Loading from "./utils/Loading";
import "./allfood.css";
import "./tailwind.css";
import { Fab, Grid, Box, Typography } from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import Food from "../services/food";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";

import AddFoodDialog from "./employee/AddFoodDialog";
import { useGetUser } from "../context/UserContext";

const Allfood = () => {
	const { showBoundary } = useErrorBoundary();
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [loading, setLoading] = useState(false);
	const [cardData, setCardData] = useState([]);
	const { accessToken } = useAuth();
	const { user } = useGetUser();

	useEffect(() => {
		const fetchData = async () => {
			try {
				console.log(user);
				const res = await Food.getAllFood({ authToken: accessToken });
				console.log(res);
				if (res.status === 200) {
					setCardData(res.data);
				}
			} catch (error) {
				const e = new Error();
				e.message =
					"شما به محتوا درخواست شده دسترسی ندارید لطفا ابتدا وارد شوید.";
				e.name = "خطای احراز هویت";
				showBoundary(e);
			}
		};
		fetchData();
	}, [accessToken]);
	const [isCalendarOpen, setCalendarOpen] = useState(false);

	const handleCalendarButtonClick = () => {
		setCalendarOpen(true);
	};

	const handleCloseCalendar = () => {
		setCalendarOpen(false);
	};

	const handleAddFood = async (data) => {
		try {
			const resFood = await Food.create({
				data: data.info,
				authToken: accessToken,
			});
			await Food.uploadImage({
				uid: resFood.data.data.id,
				file: data.image.file,
				authToken: accessToken,
			});
			setLoading(true);
			const res = await Food.getAllFood({ authToken: accessToken });
			setCardData(res.data);
			setLoading(false);
		} catch (error) {
			const e = new Error();
			e.message =
				"در هنگام افزودن غذا خطایی رخ داد لطفا دوباره تلاش کنید و در صورت تکرار خطا به پشتیبانی مراجعه کنید.";
			e.name = "خطایی رخ داد | غذا اضافه نشد";
			showBoundary(e);
			setLoading(false);
		}
	};

	const handleAddBtnClick = () => {
		setOpenAddDialog(true);
	};

	const handleClose = () => {
		setOpenAddDialog(false);
	};

	if (cardData.length > 0) {
		return (
			<div>
				{user.role !== "u" ? (
					<Fab
						onClick={handleAddBtnClick}
						variant="extended"
						style={{
							position: "fixed",
							bottom: 0,
							left: 0,
							margin: "16px",
						}}>
						<AddCircle sx={{ mr: 1 }} />
						<Typography>افزودن غذا</Typography>
					</Fab>
				) : (
					""
				)}

				{openAddDialog && (
					<AddFoodDialog
						open={openAddDialog}
						handleClose={handleClose}
						handleAddFood={handleAddFood}
					/>
				)}
				<div className=" bg-cover  flex flex-col justify-center items-center allfoodbody">
					<div className="flex flex-col justify-center items-center relative">
						<p className="allfoodtext mb-8">رزرو غذا</p>
						<div
							className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-6"
							id="allfoodcardContainer">
							{cardData.map((cardInfo, index) => (
								<Link
									key={index}
									to={`/food/${cardInfo.id}`}>
									<div
										key={index}
										className="allfoodcard  p-2 flex flex-col sm:flex-col lg:flex-row items-center">
										<img
											src={cardInfo.image}
											className="allfoodimage object-cover mb-3 lg:ml-1  sm:mb-4 lg:mb-0"
											alt={`Image for Card ${index + 1}`}
										/>
										<div>
											<p className="allfoodcard-text  mb-3 lg:mr-2 ">
												{cardInfo.name}
											</p>
											<p className="allfoodcard-text  lg:mr-2">
												{cardInfo.price}
											</p>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
					{isCalendarOpen && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
							<div className="relative p-4 rounded-lg shadow-xl w-72 allfoodpop-up flex flex-col items-center justify-center gap-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="25"
									height="25"
									viewBox="0 0 25 25"
									fill="none"
									id="closeCalendar"
									className="absolute top-2 mb-4 right-2 h-6 w-6 text-gray-600 hover:text-gray-800 cursor-pointer"
									onClick={handleCloseCalendar}>
									<path
										d="M18.5 6.5L6.5 18.5"
										stroke="#5F5C58"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M6.5 6.5L18.5 18.5"
										stroke="#5F5C58"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<input
									type="date"
									className="allfooddate border border-gray-300 mt-6 rounded w-full px-3 py-2 focus:outline-none focus:border-blue-500"
								/>
								<button className="allfoodchange">اعمال تغییرات</button>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	} else {
		return <Loading />;
	}
};

export default Allfood;
