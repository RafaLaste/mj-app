import React, { useState, useEffect } from "react";

import CityPurchases from "./CityPurchases";
import DayPurchases from "./DayPurchases";
import CityMembers from "./CityMembers";
import DayMembers from "./DayMembers";
import DrawData from "./DrawData";

const ReportsList = ({ current }) => {
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cityLoading, setCityLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    
    const accessToken = localStorage.getItem("access_token");
    const baseUrl = process.env.REACT_APP_API_URL;

    const fetchCitiesStates = async (pageNum = 1) => {
        if (!hasMore || cityLoading) return;

        setCityLoading(true);

        try {
            const response = await fetch(`${baseUrl}/manager/cidades?per_page=100&page=${pageNum}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (!response.ok) throw new Error("Erro ao buscar as cidades.");

            const data = await response.json();

            setStates(data.estados);
            setCities((prev) => [...prev, ...data.cidades.data]);

            if (!data.cidades.next_page_url) {
                setHasMore(false);
            } else {
                setPage(pageNum + 1);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCityLoading(false);
        }
    };

    useEffect(() => {
        if (hasMore) {
            fetchCitiesStates(page);
        }
    }, [page, hasMore]);

    const renderChart = () => {
        switch (current) {
            case 'purchasesCity':
                return <CityPurchases cities={cities} states={states} />;
            case 'purchasesDay':
                return <DayPurchases cities={cities} states={states} />;
            case 'membersCity':
                return <CityMembers cities={cities} states={states} />;
            case 'membersDay':
                return <DayMembers cities={cities} states={states} />;
            case 'drawData':
                return <DrawData />;
            default:
                return null;
        }
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow xl:pb-1">
            {renderChart()}
        </div>
    );
};

export default ReportsList;
