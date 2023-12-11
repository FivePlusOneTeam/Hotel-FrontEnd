import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";
import {
	CssBaseline,
	Box,
	Toolbar,
	List,
	Typography,
	Divider,
	IconButton,
	Avatar,
	Badge,
	Container,
	Grid,
	Paper,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import {
	RoomPreferences,
	RoomService,
	FoodBankOutlined,
	FoodBank,
	Assignment,
	People,
	ShoppingCart,
	Dashboard as DashboardIcon,
	ChevronLeft,
} from "@mui/icons-material";

import AvatarCard from "../components/dashboard/AvatarCard";
import RoomCard from "../components/dashboard/RoomCard";
import AddRoom from "../components/addroom";
import AllRoom from "../components/Allroom";
import { useAuth } from "../context/AuthContext";
import PaymentPage from "../pages/Payment";
import User from "../services/user";
import Loading from "../components/utils/Loading";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	"& .MuiDrawer-paper": {
		position: "relative",
		whiteSpace: "nowrap",
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		boxSizing: "border-box",
		...(!open && {
			overflowX: "hidden",
			transition: theme.transitions.create("width", {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			width: theme.spacing(7),
			[theme.breakpoints.up("sm")]: {
				width: theme.spacing(9),
			},
		}),
	},
}));

// const getUser = async (accessToken) => {
// 	try {
// 		const res = await User.getOne({ accessToken: accessToken });
// 		return res.data;
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

const Dashboard = () => {
	const Navigate = useNavigate();
	/* auth */
	// const { accessToken, refreshAccessFunc } = useAuth();
	// const checkLoginStatus = async (access) => {
	// 	if (!access) {
	// 		Navigate("/login");
	// 	} else {
	// 		try {
	// 			await refreshAccessFunc();
	// 		} catch (error) {
	// 			Navigate("/login");
	// 		}
	// 	}
	// };
	// checkLoginStatus(accessToken);
	// End Auth

	const [user, setUser] = useState(null);
	const [open, setOpen] = useState(false);
	const [page, setPage] = useState(0);
	const togglePage = (num) => {
		console.log(num);
		setPage(num);
	};
	const toggleDrawer = () => {
		setOpen(!open);
	};

	// const user = getUser(accessToken);
	const { accessToken } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await User.getOne({ accessToken: accessToken });
				console.log(response.data);
				setUser(response.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, [accessToken]);

	const pages = [
		dashboardPage(user), // محتویات داشبورد
		<AllRoom />, // رزرو اتاق
		tempPage(), // رزرو غذا
		<PaymentPage />, // تسویه حساب
		tempPage(), //پذیرش
		<AddRoom />, //افزودن اتاق
		tempPage(), //گزارش های مالی
		tempPage(), //لیست کارمندان
		tempPage(), //افزودن کارمند
		tempPage(), // رزرو ها
		tempPage(), // افزودن غذا
		tempPage(), // ویرایش غذا
		tempPage(), // گزارش رستوران
	];
	if (user) {
		return (
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<AppBar
					position="absolute"
					open={open}>
					<Toolbar
						sx={{
							pr: "24px",
						}}>
						<IconButton
							edge="start"
							color="inherit"
							aria-label="open drawer"
							onClick={toggleDrawer}
							sx={{
								marginRight: "36px",
								...(open && { display: "none" }),
							}}>
							<MenuIcon />
						</IconButton>
						<Typography
							onClick={() => Navigate("/profile")}
							component="h1"
							variant="h6"
							color="inherit"
							noWrap
							sx={{ flexGrow: 1 }}>
							داشبورد
						</Typography>
						<Typography sx={{ paddingRight: 1 }}>
							{user.firstName + " " + user.lastName}
						</Typography>
						<IconButton onClick={() => Navigate("/profile")}>
							<Avatar src={user.image}></Avatar>
						</IconButton>
					</Toolbar>
				</AppBar>
				<Drawer
					variant="permanent"
					open={open}>
					<Toolbar
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-end",
							px: [1],
						}}>
						<IconButton onClick={toggleDrawer}>
							<ChevronLeft />
						</IconButton>
					</Toolbar>
					<Divider />
					<List component="nav">
						{/* main item list(evry user)*/}
						<ListItemButton onClick={() => togglePage(0)}>
							<ListItemIcon>
								<DashboardIcon />
							</ListItemIcon>
							<ListItemText primary="داشبورد" />
						</ListItemButton>
						<ListItemButton onClick={() => togglePage(1)}>
							<ListItemIcon>
								<RoomPreferences />
							</ListItemIcon>
							<ListItemText primary="رزرو اتاق" />
						</ListItemButton>
						<ListItemButton onClick={() => togglePage(2)}>
							<ListItemIcon>
								<RoomService />
							</ListItemIcon>
							<ListItemText primary="رزور غذا" />
						</ListItemButton>
						<ListItemButton onClick={() => togglePage(3)}>
							<ListItemIcon>
								<ShoppingCart />
							</ListItemIcon>
							<ListItemText primary="تسویه حساب" />
						</ListItemButton>
						{user.role && (
							<>
								{(user.role === "a" ||
									user.role === "m" ||
									user.role === "d") && (
									<>
										<Divider sx={{ my: 1 }} />
										<ListSubheader
											component="div"
											inset>
											گزارش های ادمین
										</ListSubheader>
										<ListItemButton onClick={() => togglePage(4)}>
											<ListItemIcon>
												<People />
											</ListItemIcon>
											<ListItemText primary="پذیرش" />
										</ListItemButton>
										<ListItemButton onClick={() => togglePage(5)}>
											<ListItemIcon>
												<RoomPreferences />
											</ListItemIcon>
											<ListItemText primary="افزودن اتاق" />
										</ListItemButton>
										<ListItemButton onClick={() => togglePage(6)}>
											<ListItemIcon>
												<Assignment />
											</ListItemIcon>
											<ListItemText primary="گزارش های مالی" />
										</ListItemButton>
										<ListItemButton onClick={() => togglePage(7)}>
											<ListItemIcon>
												<People />
											</ListItemIcon>
											<ListItemText primary="لیست کارمندان" />
										</ListItemButton>
										<ListItemButton onClick={() => togglePage(8)}>
											<ListItemIcon>
												<People />
											</ListItemIcon>
											<ListItemText primary="افزودن کارمند" />
										</ListItemButton>
									</>
								)}
								{(user.role === "r" ||
									user.role === "m" ||
									user.role === "d") && (
									<>
										<Divider sx={{ my: 1 }} />
										<ListSubheader
											component="div"
											inset>
											گزارش های رستوران
										</ListSubheader>
										<ListItemButton onClick={() => togglePage(9)}>
											<ListItemIcon>
												<FoodBank />
											</ListItemIcon>
											<ListItemText primary="رزرو ها" />
										</ListItemButton>
										<ListItemButton onClick={() => togglePage(10)}>
											<ListItemIcon>
												<FoodBankOutlined />
											</ListItemIcon>
											<ListItemText primary="افزودن غذا" />
										</ListItemButton>
										<ListItemButton onClick={() => togglePage(11)}>
											<ListItemIcon>
												<FoodBankOutlined />
											</ListItemIcon>
											<ListItemText primary="ویرایش غذا" />
										</ListItemButton>
										<ListItemButton onClick={() => togglePage(12)}>
											<ListItemIcon>
												<Assignment />
											</ListItemIcon>
											<ListItemText primary="گزارش" />
										</ListItemButton>
									</>
								)}
							</>
						)}
					</List>
				</Drawer>
				<Box
					component="main"
					sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === "light"
								? theme.palette.grey[100]
								: theme.palette.grey[900],
						flexGrow: 1,
						height: "100vh",
						overflow: "auto",
					}}>
					<Toolbar />
					{pages[page]}
				</Box>
			</Box>
		);
	} else {
		return <Loading />;
	}
};

function dashboardPage(user) {
	if (user) {
		return (
			<Container
				maxWidth="lg"
				sx={{ mt: 4, mb: 4 }}>
				<Grid
					container
					spacing={3}>
					<Grid
						item
						xs={12}
						md={8}
						lg={9}>
						<RoomCard />
					</Grid>
					<Grid
						item
						xs={12}
						md={4}
						lg={3}>
						<AvatarCard
							fullname={user.firstName + " " + user.lastName}
							Photo={user.image}
						/>
					</Grid>
					<Grid
						item
						xs={12}></Grid>
				</Grid>
			</Container>
		);
	}
}

export default Dashboard;

function tempPage() {
	return (
		<Container
			maxWidth="lg"
			sx={{ mt: 4, mb: 4 }}>
			<Grid
				container
				spacing={3}>
				<Typography>این یک صفحه تستی است</Typography>
			</Grid>
		</Container>
	);
}