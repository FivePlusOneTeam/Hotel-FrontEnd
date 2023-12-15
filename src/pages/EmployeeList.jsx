import { useState, useEffect } from "react";
import {
	Box,
	Divider,
	Grid,
	Typography,
	Button,
	Paper,
	TableRow,
	TableHead,
	TableContainer,
	TableCell,
	TableBody,
	Table,
	Fab,
	Container,
} from "@mui/material";

import Admin from "../services/admin";
import { useAuth } from "../context/AuthContext";
import { AddCircle, CleaningServices } from "@mui/icons-material";
import AddEmployeeDialog from "../components/employee/AddEmployeeDialog";
import EditEmployeeDialog from "../components/employee/EditEmployeeDialog";
import DeleteEmployeeDialog from "../components/employee/DeleteEmployeeDialog";
import EmployeeInfoDialog from "../components/employee/EmployeeInfoDialog";

const EmployeeList = () => {
	const [empList, setEmpList] = useState([]);
	const { accessToken } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await Admin.getAll({ authToken: accessToken });
				console.log(res);
				if (res.status === 200) {
					setEmpList(res.data);
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, [accessToken]);

	const [selectedEmployee, setSelectedEmployee] = useState({});

	//? CRUD Dialogs
	const [openAddDialog, setOpenAddDialog] = useState(false); // Ceate
	const [openInfoDialog, setOpenInfoDialog] = useState(false); // Read
	const [openEditDialog, setOpenEditDialog] = useState(false); // Update
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Delete

	//? CRUD BTN open dialogs
	const handleAddBtnClick = () => {
		setOpenAddDialog(true);
	};
	const handleInfoBtnClick = (emp) => {
		setSelectedEmployee(emp);
		setOpenInfoDialog(true);
	};
	const handleEditBtnClick = (emp) => {
		console.log(emp);
		setSelectedEmployee(emp);
		setOpenEditDialog(true);
	};
	const handleDeleteBtnClick = (emp) => {
		setSelectedEmployee(emp);
		setOpenDeleteDialog(true);
	};

	//? Close all dialogs
	const handleClose = () => {
		setOpenAddDialog(false);
		setOpenInfoDialog(false);
		setOpenEditDialog(false);
		setOpenDeleteDialog(false);
	};

	//? handle submit functions
	const handleAddEmployee = () => {
		setTimeout(() => console.log("add"), 1000);
	};
	const handleEditEmployee = () => {
		console.log("edit");
	};
	const handleDeleteEmployee = () => {
		console.log("delete");
	};

	return (
		<Container
			maxWidth="lg"
			sx={{ mt: 4, mb: 4 }}>
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
				<Typography>افزودن کارمند</Typography>
			</Fab>
			<Paper
				sx={{
					padding: 2,
				}}>
				<Grid item>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							bgcolor: "#303030",
							p: 2,
						}}>
						<Typography variant="h5">لیست کارمندان</Typography>
					</Box>
					<Divider />
					<TableContainer>
						<Table aria-label="caption table">
							<TableHead sx={{}}>
								<TableRow>
									<TableCell>
										<Typography variant="h6">نام</Typography>
									</TableCell>
									{/* <TableCell align="center">
										<Typography variant="h6">کد ملی</Typography>
									</TableCell> */}
									<TableCell align="center">
										<Typography variant="h6">مقام</Typography>
									</TableCell>
									{/* <TableCell align="center">
										<Typography variant="h6">ایمیل</Typography>
									</TableCell> */}
									<TableCell align="center">
										{/* <Typography variant="h6">عملیات ها</Typography> */}
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{empList.map((emp) => (
									<TableRow key={emp.id}>
										<TableCell
											component="th"
											scope="row">
											{emp.firstName + " " + emp.lastName}
										</TableCell>
										{/* <TableCell align="center">
											<Typography>{emp.nationalCode}</Typography>
										</TableCell> */}
										<TableCell align="center">
											<Typography>{Role(emp.role)}</Typography>
										</TableCell>
										{/* <TableCell align="center">
											<Typography>{emp.email}</Typography>
										</TableCell> */}

										<TableCell align="right">
											<Button
												onClick={() => handleInfoBtnClick(emp)}
												variant="contained"
												sx={{
													m: 1,
													minWidth: 100,
													bgcolor: "	#0096FF",
													color: "#FFFFFF",
												}}>
												<Typography variant="h6">اطلاعات</Typography>
											</Button>
											<Button
												onClick={() => handleEditBtnClick(emp)}
												variant="contained"
												sx={{
													m: 1,
													minWidth: 100,
													bgcolor: "#ff6600",
													color: "#FFFFFF",
												}}>
												<Typography variant="h6">ویرایش</Typography>
											</Button>
											<Button
												onClick={() => handleDeleteBtnClick(emp)}
												variant="contained"
												sx={{
													minWidth: 100,
													m: 1,
													bgcolor: "#ff0000",
													color: "#FFFFFF",
												}}>
												<Typography variant="h6">حذف</Typography>
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					{openAddDialog && (
						<AddEmployeeDialog
							open={openAddDialog}
							handleClose={handleClose}
							handleAddEmployee={handleAddEmployee}
						/>
					)}
					{openInfoDialog && (
						<EmployeeInfoDialog
							open={openInfoDialog}
							handleClose={handleClose}
							employeeData={selectedEmployee}
						/>
					)}
					{openEditDialog && (
						<EditEmployeeDialog
							employeeData={selectedEmployee}
							open={openEditDialog}
							handleClose={handleClose}
							handleEditEmployee={handleEditEmployee}
						/>
					)}
					{openDeleteDialog && (
						<DeleteEmployeeDialog
							open={openDeleteDialog}
							employeeData={selectedEmployee}
							handleClose={handleClose}
							handleDeleteEmployee={handleDeleteEmployee}
						/>
					)}
				</Grid>
			</Paper>
			{/* </Grid> */}
		</Container>
	);
};

const Role = (role) => {
	switch (role) {
		case "m":
			return "مدیر هتل";

		case "d":
			return "معاون هتل";

		case "a":
			return "پذیرش هتل";

		case "r":
			return "مدیر رستوران";
	}
};

export default EmployeeList;
