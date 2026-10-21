import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { GetDashboard, ExportCsv } from "@/service/analytics";
import { setDashboardData, setLoading, setError } from "@/store/dashboardSlice";

export function useDashboard() {
  const dispatch = useDispatch();
  const { data, isLoading, error } = useSelector((state) => state.dashboard);

  const fetchDashboard = useCallback(async (startTime, endTime) => {
    dispatch(setLoading());
    try {
      const response = await GetDashboard(startTime, endTime);
      
      if (response.data.success) {
        dispatch(setDashboardData(response.data.data)); 
      } else {
        dispatch(setError("API returned success: false"));
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      dispatch(setError(err.response?.data?.message || "Failed to fetch dashboard data"));
    }
  }, [dispatch]);

  // Accept dates for the export
  const downloadCsv = async (startTime, endTime) => {
    try {
      const response = await ExportCsv(startTime, endTime);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `dashboard-export-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download CSV", err);
    }
  };

  return { data, isLoading, error, fetchDashboard, downloadCsv };
}