import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../loading/Loading";

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
  const [isZoomed, setIsZoomed] = useState(false);

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
    return <Loading />;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!data) {
    return <p className="text-center text-gray-500">No data available.</p>;
  }

  const handleZoom = () => setIsZoomed(true);
  const handleClose = () => setIsZoomed(false);

  return (
    <div className="p-4 bg-[#1e293b] rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-white text-center mb-4">{data.title}</h2>
      {data.media_type === "image" ? (
        <>
          <img
            src={data.url}
            alt={data.title}
            className="w-full h-48 object-cover rounded-md mb-4 cursor-pointer"
            onClick={handleZoom}
          />
          {isZoomed && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center backdrop-blur-sm">
              <img
                src={data.url}
                alt={data.title}
                className="max-w-full max-h-full rounded-md shadow-lg"
              />
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full p-2"
              >
                ✕
              </button>
            </div>
          )}
        </>
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
