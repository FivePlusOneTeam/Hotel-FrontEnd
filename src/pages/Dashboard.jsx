import React, { useState, useEffect } from "react";
import {
	Box,
	Divider,
	Grid,
	Typography,
	Paper,
	Fab,
	Container,
} from "@mui/material";
import { AttachMoneyOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AvatarCard from "../components/dashboard/AvatarCard";
import RoomCard from "../components/dashboard/RoomCard";
import Loading from "../components/utils/Loading";
import Room from "../services/room";
import Food from "../services/food";
import Images from "../assets/images";
import ReservationList from "../components/dashboard/ReservationList";

const DashboardPage = ({ user, payment, setPayment }) => {
	const [room, setRoom] = useState(null);
	const { accessToken } = useAuth();
	const Navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [reserve, setReserve] = useState({
		food: [],
		room: [],
	});
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const resRoom = await Room.getUserAll({ authToken: accessToken });
				const resFood = await Food.getUserAll({ authToken: accessToken });
				const todayFoods = await Food.todayResFoods({ authToken: accessToken });
				const res = await Room.getUserRoom({ authToken: accessToken });
				console.log(todayFoods);
				setPayment({
					room: resRoom.data.payments,
					food: resFood.data.payments,
				});
				setReserve({
					food: todayFoods.data.payments,
					room: res.data.payments,
				});
				if (res.data.payments[0]) {
					setRoom(res.data.payments[0]);
				}
			} catch (error) {
				alert(error);
			}
			setLoading(false);
		};
		fetchData();
	}, [accessToken]);
	if (!loading) {
		return (
			<Container
				maxWidth="lg"
				sx={{ mt: 4, mb: 4 }}>
				<Fab
					onClick={() => Navigate("/faq")}
					variant="circular"
					style={{
						position: "fixed",
						bottom: 16,
						left: 16,
						margin: "12px",
					}}>
					<HelpOutlineIcon fontSize="large" />
				</Fab>

				<Grid
					container
					spacing={3}>
					<Grid
						item
						xs={12}
						md={8}
						lg={8}>
						<RoomCard room={room} />
					</Grid>
					<Grid
						item
						xs={12}
						md={4}
						lg={4}>
						<AvatarCard
							fullname={user.firstName + " " + user.lastName}
							Photo={Images.baseUrl + user.image}
							role={user.role}
							email={user.email}
						/>
						<Paper
							sx={{
								padding: 2,
								mt: 2,
							}}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									p: 2,
								}}>
								<AttachMoneyOutlined />
								<Typography>صورت حساب در لحظه</Typography>
							</Box>
							<Divider />
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									p: 2,
								}}>
								<Typography>رزرو اتاق : </Typography>
								<Typography> {Sum(payment.room)} تومان</Typography>
							</Box>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									p: 2,
								}}>
								<Typography>رستوران : </Typography>
								<Typography> {Sum(payment.food)} تومان</Typography>
							</Box>
							<Divider />
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									p: 2,
								}}>
								<Typography>{"مجموع مبلغ قابل پرداخت :"}</Typography>
								<Typography>
									{Sum(payment.room) + Sum(payment.food)} تومان
								</Typography>
							</Box>
						</Paper>
					</Grid>

					<Grid
						item
						xs={12}
						md={8}
						lg={8}
						>
						<ReservationList
							roomList={reserve.room}
							foodList={reserve.food}
						/>	
					</Grid>

				</Grid>
			</Container>
		);
	} else {
		return <Loading />;
	}
};

export default DashboardPage;

const Sum = (array) => {
	let sum = 0;
	if (array != null) {
		array.map((value) => {
			sum += value.remain_paid;
		});
	}
	return sum;
};
