import "./SetUpForm.scss";
import React, { useState } from "react";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    onNext();
  };

  return (
    <div className="container">
      <div>
        <h1>
          Welcome to WAE <br />
          Set Up Your Account
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
