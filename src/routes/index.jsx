import { Routes, Route } from "react-router-dom";

import Landing from "../components/landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AboutUs from "../components/AboutUs";
import Room from "../components/eachroom";
import Food from "../components/eachfood";
import AllRoom from "../components/allroom";
import Reception from "../components/reception";
import EmployeeList from "../components/employee_list";
import Eachroom from "../components/eachroom";
import Allfood from "../components/allfood";
import Eachfood from "../components/eachfood";

const Router = () => {
	return (
		<Routes>
			<Route
				path="/"
				element={<Landing />}
			/>
			<Route
				path="/aboutus"
				element={<AboutUs />}
			/>
			<Route
				path="/dashboard"
				element={<Dashboard />}
			/>
			<Route
				path="/allroom"
				element={<AllRoom />}
			/>
			<Route
				path="/allfood"
				element={<Allfood />}
			/>
			<Route
				path="/reception"
				element={<Reception />}
			/>
			<Route
				path="/employees"
				element={<EmployeeList />}
			/>
			<Route
				path="/eachroom"
				element={<Eachroom />}
			/>
			<Route
				path="/eachfood"
				element={<Eachfood />}
			/>
			<Route
				path="/login"
				element={<Login />}
			/>
			<Route
				path="/register"
				element={<Register />}
			/>
			<Route
				path="/room/:id"
				element={<Room />}
			/>
			<Route
				path="/food/:id"
				element={<Food />}
			/>
		</Routes>
	);
};

export default Router;
