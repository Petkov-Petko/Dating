import "./SetUpForm.scss";
import React, { useState } from "react";
import { updateUserDetails } from "../../service/db-service";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";

interface SetUpFormProps {
  onNext: () => void;
}

const SetUpForm: React.FC<SetUpFormProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    birthDate: "",
    gender: "male",
    address: "",
    country: "",
    city: "",
    title: "",
    description: "",
  });
  const userId = useSelector((state: RootState) => state.data.user.user?.uid);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }
    try {
      await updateUserDetails(userId, formData);
      onNext();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div>
        <h1>
          Welcome to <span className="logo_text">Flirty</span>
        </h1>
        <p>Fill in the information below to set up your account.</p>
      </div>
      <form className="form" action="#" onSubmit={handleSubmit}>
        <div className="column">
          <div className="input-box">
            <label>First Name</label>
            <input
              required
              placeholder="Jon"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="input-box">
            <label>Last Name</label>
            <input
              required
              placeholder="Doe"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="column">
          <div className="input-box">
            <label>Phone Number</label>
            <input
              required
              placeholder="Enter phone number"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="input-box">
            <label>Birth Date</label>
            <input
              required
              placeholder="Enter birth date"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="gender-box">
          <label>Gender</label>
          <div className="gender-option">
            <div className="gender">
              <input
                checked={formData.gender === "male"}
                name="gender"
                id="check-male"
                type="radio"
                value="male"
                onChange={handleChange}
              />
              <label htmlFor="check-male">Male</label>
            </div>
            <div className="gender">
              <input
                checked={formData.gender === "female"}
                name="gender"
                id="check-female"
                type="radio"
                value="female"
                onChange={handleChange}
              />
              <label htmlFor="check-female">Female</label>
            </div>
          </div>
        </div>
        <div className="input-box address">
          <label>Address</label>
          <input
            required
            placeholder="Enter street address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <div className="column">
            <div className="select-box">
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
              >
                <option hidden>Country</option>
                <option value="Bulgaria">Bulgaria</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Germany">Germany</option>
                <option value="Japan">Japan</option>
              </select>
            </div>
            <input
              required
              placeholder="Enter your city"
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <div>
            <div className="input-box">
              <label>Title</label>
              <input
                required
                placeholder="Enter title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div className="input-box">
              <label>Description</label>
              <textarea
                required
                placeholder="Enter description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default SetUpForm;
