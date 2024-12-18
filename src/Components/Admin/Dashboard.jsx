import {useState, useEffect, useMemo} from "react";
import styled from "styled-components";
import axios from "axios";
import {
    Chart as ChartJS,
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import {Bar, Line} from "react-chartjs-2";
import Loading from "../../utils/Loading.jsx";

ChartJS.register(
    BarElement,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
);

const WrapperAll = styled.div`
    position: absolute;
    top: 10%;
    left: 18%;
    width: 78%;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
`;

const TitleCustom = styled.h2`
    margin-top: 0;
`

const CardContainer = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding: 10px;
`;

const Card = styled.div`
    flex: 0 0 auto;
    background-color: #f1f1f1;
    border-radius: 8px;
    padding: 20px;
    min-width: 150px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    h3 {
        margin: 0 0 10px;
        font-size: 18px;
        color: #007bff;
    }

    p {
        margin: 0;
        font-size: 16px;
        font-weight: bold;
    }
`;

const ChartContainer = styled.div`
    margin: 20px 0;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterContainer = styled.div`
    margin: 10px 0 20px;
    display: flex;
    align-items: center;
    gap: 10px;

    label {
        font-size: 16px;
        font-weight: 500;
        color: #333;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    select {
        padding: 8px 12px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #fff;
        color: #333;
        outline: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;

        &:hover {
            border-color: #007bff;
        }

        &:focus {
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
        }
    }
`;

function calculateRevenueByCategory(data) {
    const revenueByCategory = {};

    data.forEach((item) => {
        const category = item.show_time_id?.film_id?.category_id?.category_name || "Unknown";
        const paidAmount = item.paid_amount || 0;

        if (!revenueByCategory[category]) {
            revenueByCategory[category] = 0;
        }

        revenueByCategory[category] += paidAmount;
    });

    return revenueByCategory;
}

function groupDataByMonthAndBranch(data) {
    const groupedData = {};

    data.forEach((item) => {
        const month = new Date(item.created_at).toISOString().slice(0, 7);
        const branchName = item.show_time_id?.branch_id?.branch_name || "Unknown";
        const paidAmount = item.paid_amount || 0;

        if (!groupedData[month]) {
            groupedData[month] = {};
        }

        if (!groupedData[month][branchName]) {
            groupedData[month][branchName] = 0;
        }

        groupedData[month][branchName] += paidAmount;
    });

    return groupedData;
}

function prepareChartData(groupedData) {
    const months = Object.keys(groupedData); // Các tháng
    const branches = Array.from(
        new Set(
            months.flatMap((month) => Object.keys(groupedData[month]))
        )
    );

    const datasets = branches.map((branch, index) => ({
        label: branch,
        data: months.map((month) => groupedData[month][branch] || 0),
        backgroundColor: `hsl(${(index * 60) % 360}, 70%, 60%)`,
        borderColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
        borderWidth: 1,
    }));

    return {
        labels: months,
        datasets,
    };
}

function groupDataByMonth(data) {
    const groupedData = {};

    data.forEach((item) => {
        const month = new Date(item.created_at).toISOString().slice(0, 7);
        const paidAmount = item.paid_amount || 0;

        if (!groupedData[month]) {
            groupedData[month] = 0;
        }

        groupedData[month] += paidAmount;
    });

    return groupedData;
}

function prepareLineChartData(groupedData) {
    const months = Object.keys(groupedData).sort();
    const totalRevenue = months.map((month) => groupedData[month]);

    return {
        labels: months,
        datasets: [
            {
                label: "Tổng doanh thu (VND)",
                data: totalRevenue,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4,
                fill: true,
            },
        ],
    };
}

const apiGetPayment = import.meta.env.VITE_API_PAYMENT_URL

function Dashboard() {
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedYear, setSelectedYear] = useState("2024");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(apiGetPayment, {
                    headers: {"Content-Type": "application/json"},
                });
                setApiData(response.data);
                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false)
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        return apiData.filter((item) =>
            new Date(item.created_at).getFullYear().toString() === selectedYear
        );
    }, [apiData, selectedYear]);

    const revenueByCategory = useMemo(
        () => calculateRevenueByCategory(filteredData),
        [filteredData]
    );

    const totalRevenueByCategory = useMemo(
        () => Object.values(revenueByCategory).reduce((sum, value) => sum + value, 0),
        [revenueByCategory]
    );

    const groupedDataForBarChart = useMemo(
        () => groupDataByMonthAndBranch(filteredData),
        [filteredData]
    );
    const barChartData = useMemo(
        () => prepareChartData(groupedDataForBarChart),
        [groupedDataForBarChart]
    );

    const groupedDataForLineChart = useMemo(
        () => groupDataByMonth(filteredData),
        [filteredData]
    );
    const lineChartData = useMemo(
        () => prepareLineChartData(groupedDataForLineChart),
        [groupedDataForLineChart]
    );

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.raw.toLocaleString()} VND`;
                    },
                },
            },
        },
    };

    return (
        <>
            {loading && <Loading/>}
            <WrapperAll>
                <TitleCustom>Thống kê doanh thu</TitleCustom>
                <FilterContainer>
                    <label>
                        Năm:
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {Array.from(
                                new Set(apiData.map((item) => new Date(item.created_at).getFullYear()))
                            ).map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </label>
                </FilterContainer>

                <CardContainer>
                    {Object.entries(revenueByCategory).map(([category, revenue]) => (
                        <Card key={category}>
                            <h3>{category}</h3>
                            <p>{revenue.toLocaleString()} VND</p>
                        </Card>
                    ))}
                    <Card>
                        <h3>Total</h3>
                        <p>{totalRevenueByCategory.toLocaleString()} VND</p>
                    </Card>
                </CardContainer>

                <h2>1. Doanh thu theo tháng và chi nhánh</h2>
                <ChartContainer>
                    <Bar data={barChartData} options={options}/>
                </ChartContainer>
                <h2>2. Xu hướng tổng doanh thu theo tháng</h2>
                <ChartContainer>
                    <Line data={lineChartData} options={options}/>
                </ChartContainer>
            </WrapperAll>
        </>
    );
}

export default Dashboard;