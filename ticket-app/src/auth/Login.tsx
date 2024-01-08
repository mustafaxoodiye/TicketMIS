import { ENDPIONTS, httpService, SECRET_KEY } from "@api";
import { AuthViewModel, UserInfoViewModel } from "@viewModels";
import jwtDecode from "jwt-decode";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import crypto from "crypto-js";
import { Helmet } from "react-helmet";

const Login = () => {
  const [urlParams] = useSearchParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const [errMsg, setErrMsg] = useState<string | null>(null);

  try {
    var value = localStorage.getItem("sys_user");
    if (typeof value === "string") {
      var currentUser: string = JSON.parse(value);
      if (currentUser) {
        return <Navigate to={`/`} />;
      }
    }
  } catch (error) {
    console.log({ error });
  }

  const onSubmit = async (data: AuthViewModel, e: any) => {
    e.preventDefault();
    setIsLoading(true);

    var credential: AuthViewModel = {
      userName: data.userName,
      password: data.password,
    };

    const res = await httpService(ENDPIONTS.User.login).post(credential);
    if (res && res.status === 200) {
      const userInfo = decodeToken(res?.data?.token);

      // Encrypt
      var ciphertext = crypto.AES.encrypt(
        JSON.stringify(userInfo),
        SECRET_KEY
      ).toString();

      localStorage.setItem("sys_user", JSON.stringify(ciphertext));

      const returnUrl = urlParams.get("returnUrl");
      if (returnUrl && returnUrl.length > 0) {
        navigate(returnUrl, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }

    setIsLoading(false);
    e.target.reset();
  };

  const decodeToken = (token: string) => {
    var decode: any = jwtDecode(token);

    var userInfo: UserInfoViewModel = {
      userId: decode?.userId,
      userName: decode?.userName,
      roleId: decode?.roleId,
      roleName: decode?.roleName,
      userType: decode?.userType,
      fullName: decode?.fullName,
      accessLevel: decode?.accessLevel,
      accessableTickets: JSON.parse(decode?.accessableTickets),

      token: token,
    };

    return userInfo;
  };

  return (
    <div className="form">
      <Helmet>
        <title>Login</title>
        {/* Start Login page styles */}
        <link
          href="/assets/css/authentication/form-1.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="/assets/css/forms/theme-checkbox-radio.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="/assets/css/forms/switches.css"
        />
        {/* End Login page styles */}
      </Helmet>
      <div className="form-container">
        <div className="form-form">
          <div className="form-form-wrap">
            <div className="form-container">
              <div className="form-content">
                <h1>
                  Log In to{" "}
                  <a href="index.html">
                    <span className="brand-name">Ticket MIS</span>
                  </a>
                </h1>
                {/* <p className="signup-link">New Here? <a href="auth_register.html">Create an account</a></p> */}
                <form className="text-left" onSubmit={handleSubmit(onSubmit)}>
                  <div className="form">
                    <div id="username-field" className="field-wrapper input">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-user"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx={12} cy={7} r={4} />
                      </svg>
                      <input
                        id="userName"
                        name="userName"
                        type="text"
                        ref={register({ required: true })}
                        onChange={() => setErrMsg(null)}
                        className="form-control"
                        placeholder="userName"
                      />
                      <span className="text-danger">
                        {errors.userName && <span>This field is required</span>}
                      </span>
                    </div>
                    <div
                      id="password-field"
                      className="field-wrapper input mb-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-lock"
                      >
                        <rect
                          x={3}
                          y={11}
                          width={18}
                          height={11}
                          rx={2}
                          ry={2}
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        ref={register({ required: true })}
                        onChange={() => setErrMsg(null)}
                        className="form-control"
                        placeholder="Password"
                      />
                      <span className="text-danger">
                        {errors.Password && <span>This field is required</span>}
                      </span>
                    </div>
                    <div className="d-sm-flex justify-content-between">
                      <div className="field-wrapper toggle-pass">
                        <p className="d-inline-block">Show Password</p>
                        <label className="switch s-primary">
                          <input
                            type="checkbox"
                            id="toggle-password"
                            className="d-none"
                            onChange={() => setShowPassword(!showPassword)}
                          />
                          <span className="slider round" />
                        </label>
                      </div>
                      <div className="field-wrapper">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? "Verifying..." : "Log In"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
                {errMsg && (
                  <div className="row mt-3">
                    <p className="text-danger font-weight-bold"> {errMsg} </p>
                  </div>
                )}
                <p className="terms-conditions">
                  © 2022 All Rights Reserved. <a href="/#">Ticket MIS</a> is a
                  product of the Ministry of Finance, Somaliland.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="form-image">
          <div className="l-image"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
