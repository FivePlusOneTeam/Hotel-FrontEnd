import React from "react";
import moment from "moment-jalaali";
import {
	Box,
	Divider,
	Grid,
	Typography,
	Button,
	Paper,
	TableRow,
	Fab,
	TableHead,
	TableContainer,
	TableCell,
	TableBody,
	Table,
	Container,
} from "@mui/material";
import { AttachMoneyOutlined, ListRounded } from "@mui/icons-material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

const PaymentPage = ({ payment }) => {
	const Navigate = useNavigate();
	const { accessToken } = useAuth();
	const handlePayment = async () => {
		try {
			const url = `https://hotelt.liara.run/api/payment`;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			};
			const res = await axios.get(url, config);
			console.log(res);
			window.location.replace(res.data.redirect_url);
		} catch (error) {
			console.log(error);
		}
	};
	console.log(payment);
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
					md={8}>
					<Paper
						sx={{
							padding: 2,
						}}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								p: 2,
							}}>
							<ListRounded />
							<Typography>فاکتور</Typography>
						</Box>
						<Divider />
						<TableContainer>
							<Table aria-label="caption table">
								<TableHead>
									<TableRow>
										<TableCell>نام محصول یا خدمات</TableCell>
										<TableCell align="center">قیمت (تومان)</TableCell>
										<TableCell align="center">تاریخ</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{payment.room.map((row) => (
										<TableRow key={row.room.number}>
											<TableCell
												component="th"
												scope="row">
												رزرو اتاق شماره : {row.room.number}
											</TableCell>
											<TableCell align="center">{row.total_price}</TableCell>
											<TableCell align="center">
												{moment(row.created, "YYYY-M-D")
													.endOf("jMonth")
													.format("jYYYY/jM/jD")}
											</TableCell>
										</TableRow>
									))}
									{payment.food.map((row) => (
										<TableRow key={row.food.created}>
											<TableCell
												component="th"
												scope="row">
												{row.food.name}
											</TableCell>
											<TableCell align="center">{row.food.price}</TableCell>
											<TableCell align="center">
												{moment(row.created, "YYYY-M-D")
													.endOf("jMonth")
													.format("jYYYY/jM/jD")}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Paper>
				</Grid>
				<Grid
					item
					xs={12}
					md={4}>
					<Paper
						sx={{
							padding: 2,
						}}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								p: 2,
							}}>
							<AttachMoneyOutlined />
							<Typography>صورت حساب</Typography>
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
							<Typography> {Sum(payment.room) + Sum(payment.food)}</Typography>
						</Box>
						<Box
							sx={{
								p: 1,
							}}>
							{Sum(payment.room) + Sum(payment.food) === 0 ? (
								<Button
									color={"inherit"}
									disabled
									fullWidth
									variant="contained"
									onClick={() => handlePayment()}>
									پرداخت
								</Button>
							) : (
								<Button
									color={"success"}
									fullWidth
									variant="contained"
									onClick={() => handlePayment()}>
									پرداخت
								</Button>
							)}
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Container>
	);
};

export default PaymentPage;

const Sum = (array) => {
	let sum = 0;
	array.map((value) => {
		sum += value.remain_paid;
	});

	return sum;
};
