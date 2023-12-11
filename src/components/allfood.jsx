import React, { useEffect, useState } from "react";
import Loading from "../components/utils/Loading";
import "./allfood.css";
import "./tailwind.css";
import popup from "../assets/allfood_popup.png";

import Food from "../services/food";
import { useAuth } from "../context/AuthContext";

const Allfood = () => {
	const [cardData, setCardData] = useState([]);
	const { accessToken } = useAuth();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await Food.getAll({ authToken: accessToken });
				console.log(res);
				if (res.status === 200) {
					setCardData(res.data);
				}
			} catch (error) {
				console.log(error);
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

	if (cardData.length > 0) {
		return (
			<div className="bg - cover bg-center flex flex-col justify-center items-center allfood">
				<div className="flex flex-col justify-center items-center relative">
					<p className="allfoodtext mb-8">رزرو غذا</p>
					<div
						className=" border-8 rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-4 b-5 p-4"
						id="allfoodcardContainer">
						{cardData.map((cardInfo, index) => (
							<div
								key={index}
								className="allfoodcard bg-white rounded p-4 flex flex-row items-center">
								<img
									src={cardInfo.image}
									className="allfoodimage object-cover mb-4 mr-4"
									alt={`Image for Card ${index + 1}`}
								/>
								<div>
									<p className="allfoodcard-text text-lg mb-2 mr-2">
										{cardInfo.name}
									</p>
									<p className="allfoodcard-text text-lg mr-2">
										{cardInfo.price}
									</p>
								</div>
							</div>
						))}
					</div>
					<button
						className="absolute top-20 right-4 -mt-3 -mr-3"
						id="calendarButton"
						onClick={handleCalendarButtonClick}>
						<img
							src={popup}
							alt="Circle Image"
							width="24px"
							height="24px"
							className="allfooditem-bg  object-contain"
						/>
					</button>
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
		);
	} else {
		return <Loading />;
	}
};

export default Allfood;
