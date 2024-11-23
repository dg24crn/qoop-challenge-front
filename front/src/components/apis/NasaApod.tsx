import React, { useEffect, useState } from "react";
import axios from "axios";

interface ApodData {
  title: string;
  explanation: string;
  url: string;
  media_type: string;
}

const NasaApod: React.FC = () => {
  const [data, setData] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApod = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.nasa.gov/planetary/apod?api_key=zUda71neBvuVAGhOiGbaN8qiUAwZ2qppMRCSNhSo`
        );
        setData(response.data);
      } catch {
        setError("Failed to fetch NASA APOD. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchApod();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading NASA APOD...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!data) {
    return <p className="text-center text-gray-500">No data available.</p>;
  }

  return (
    <div className="p-4 bg-[#1e293b] rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-white text-center mb-4">{data.title}</h2>
      {data.media_type === "image" ? (
        <img
          src={data.url}
          alt={data.title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      ) : (
        <iframe
          src={data.url}
          title={data.title}
          className="w-full h-48 rounded-md mb-4"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default NasaApod;
