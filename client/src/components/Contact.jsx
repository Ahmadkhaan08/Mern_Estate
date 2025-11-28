import React, { useEffect, useState } from "react";
const BASE_URI=import.meta.env.VITE_BACKEND_URI


function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`${BASE_URI}/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleChange}
            placeholder="Enter your message"
            className="w-full border p-3  rounded-lg"
          ></textarea>
          <button
            onClick={() => {
              const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${
                landlord.email
              }&su=${encodeURIComponent(
                "Regarding " + listing.name
              )}&body=${encodeURIComponent(message)}`;

              window.open(
                url,
                "gmailWindow",
                "width=600,height=500,left=300,top=150"
              );
            }}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </button>
        </div>
      )}
    </>
  );
}

export default Contact;
