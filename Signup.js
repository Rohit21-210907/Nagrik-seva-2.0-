import React, { useState } from 'react';

const Signup = ({ onSignupSuccess }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        contact: '',
        address: '',
        gender: 'Male'
    });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    // 🔹 Helper function to extract error message safely
    const getErrorMessage = (data) => {
        if (!data) return "Something went wrong!";
        if (typeof data.detail === "string") return data.detail;
        if (typeof data.detail === "object") return JSON.stringify(data.detail);
        return "Unexpected error occurred!";
    };

    // STEP 1: Send OTP
    const handleDetailsSubmit = async (e) => {
        e.preventDefault();

        if (!formData.contact) {
            alert("Mobile number required!");
            return;
        }
            if (!/^[0-9]{10}$/.test(formData.contact)) {
    alert("Enter valid 10-digit mobile number!");
    return;
               }         

        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ contact: formData.contact })
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || "OTP generated! Check terminal.");
                setStep(2);
            } else {
                alert(getErrorMessage(data));
            }

        } catch (err) {
            alert("Backend server not running on port 8000!");
        }

        setLoading(false);
    };

    // STEP 2: Verify OTP
    const handleOtpVerify = async () => {

        if (otp.length !== 6) {
            alert("Enter valid 6-digit OTP!");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://127.0.0.1:8000/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    ...formData,
                    otp: otp
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || "Account created successfully!");
                onSignupSuccess(formData.contact);
            } else {
                alert(getErrorMessage(data));
            }

        } catch (err) {
            alert("Connection error! Check backend.");
        }

        setLoading(false);
    };

    return (
        <div className="signup-wrapper">
            {step === 1 ? (
                <form onSubmit={handleDetailsSubmit} className="form-box">
                    <h2>Nagrik Seva - Create Account</h2>

                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="input-field"
                        onChange={(e) =>
                            setFormData({ ...formData, username: e.target.value })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Mobile Number"
                        required
                        className="input-field"
                        onChange={(e) =>
                            setFormData({ ...formData, contact: e.target.value })
                        }
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        required
                        className="input-field"
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Set Password"
                        required
                        className="input-field"
                        onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                        }
                    />

                    <textarea
                        placeholder="Resident Address"
                        required
                        className="input-field"
                        onChange={(e) =>
                            setFormData({ ...formData, address: e.target.value })
                        }
                    />

                    <select
                        className="input-field"
                        onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                        }
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <button type="submit" className="main-btn" disabled={loading}>
                        {loading ? "Sending..." : "Send OTP & Register"}
                    </button>
                </form>
            ) : (
                <div className="otp-box form-box">
                    <h2>Verify Your Number</h2>

                    <p>
                        Enter 6-digit code sent to:
                        <br />
                        <b>{formData.contact}</b>
                    </p>

                    <input
                        type="text"
                        className="otp-input"
                        maxLength="6"
                        placeholder="000000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <button
                        onClick={handleOtpVerify}
                        className="main-btn"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify & Finish"}
                    </button>

                    <button
                        onClick={() => setStep(1)}
                        className="link-btn"
                    >
                        Back to Edit
                    </button>
                </div>
            )}
        </div>
    );
};

export default Signup;