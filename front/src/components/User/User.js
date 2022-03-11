import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./user.scss";
import avatar from "../../assets/user.png";
import userService from "../../app/features/userHandling/UserService";
import Btn from "../Btn/Btn";
import { useParams } from "react-router-dom";
import { TextField } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import { NavLink } from 'react-router-dom';

const User = (props) => {
  const defaultValues = {
    password: "",
  };

  const [user, setUser] = useState([]);
  const [formValues, setFormValues] = useState(defaultValues);

  const params = useParams();
  const userId = JSON.parse(localStorage.user).id;

  const handleSubmit = (event) => {
    userService.patchUser(userId, formValues);
    console.log("mot de passe modifié");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  console.log(formValues);

  const Mobile = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    return isMobile ? children : null;
  };

  useEffect(() => {
    userService.getUser(params.id).then((res) => setUser(res.data));
  }, [params.id]);

  return (
    <div className="user">
      <div className="user__container">
        <img className="user__avatar" src={avatar} alt="Avatar" />

        <div className="user__form--desktop">
          <form
            className="user__form"
            onSubmit={handleSubmit}
            onKeyPress={handleKeyPress}
          >
            <div className="user__details">
              <div className="user__titles">
                <p className="user__title">Matricule</p>
                <p className="user__title">Prénom</p>
                <p className="user__title">NOM</p>
                <p className="user__title">Mot de passe</p>
                <p className="user__title">Fonction</p>
                <p className="user__title">Equipe</p>
              </div>

              <div className="user__contents">
                <p className="user__content">{user.reg_number}</p>
                <p className="user__content">{user.name}</p>
                <p className="user__content">{user.lastname}</p>
                <TextField
                  id="password"
                  label="Modifier votre mot de passe"
                  name="password"
                  type="password"
                  value={formValues.password}
                  onChange={handleInputChange}
                />
                <p className="user__content">{user.function}</p>
                <p className="user__content">{user.team}</p>
              </div>
            </div>
            <div className="user__btns">
                <Btn text="Valider" clicked={handleSubmit} />
                <NavLink to='/planning'>
                    <Btn text="Retour" />
                </NavLink>
            </div>
          </form>
        </div>

        <div className='user__form--mobile'>
          <form
            className="user__form"
            onSubmit={handleSubmit}
            onKeyPress={handleKeyPress}
          >
            <p className="user__title">Matricule</p>
            <p className="user__content">{user.reg_number}</p>

            <p className="user__title">Prénom</p>
            <p className="user__content">{user.name}</p>

            <p className="user__title">NOM</p>
            <p className="user__content">{user.lastname}</p>

            <p className="user__title">Mot de passe</p>
            <TextField
              id="password"
              label="Modifier votre mot de passe"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleInputChange}
            />

            <p className="user__title">Fonction</p>
            <p className="user__content">{user.function}</p>

            <p className="user__title">Equipe</p>
            <p className="user__content">{user.team}</p>
            <div className="user__btns">
                <Btn text="Valider" clicked={handleSubmit} />
                <NavLink to='/planning'>
                    <Btn text="Retour" />
                </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

User.propTypes = {};

export default User;