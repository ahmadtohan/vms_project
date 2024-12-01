import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { SpeedDial } from "primereact/speeddial";
import { Chip } from "primereact/chip";

import endPoint from "./../../services/endPoint";
import config from "./../../services/config";
import { Show } from "./../../custom/Show";

import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import { useNavigate, useLocation } from "react-router-dom";


import Aside from './Aside'

import './../../css/payment.css'
import './../../css/All.css'
import Utils from "../../services/Utils";

const Payment = () => {


    const navigate = useNavigate();


    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!loading) {



            setLoading(true);

            setTimeout(() => {



                document.querySelector('.cardNum-Input').oninput = function () {
                    document.querySelector('.cardnum-info').innerText = document.querySelector('.cardNum-Input').value;
                }
                document.querySelector('.cardHolder-Input').oninput = function () {
                    document.querySelector('.card-holder-name').innerText = document.querySelector('.cardHolder-Input').value;
                }
                document.querySelector('.month-input').oninput = function () {
                    document.querySelector('.exp-month').innerText = document.querySelector('.month-input').value;
                }
                document.querySelector('.year-input').oninput = function () {
                    document.querySelector('.exp-year').innerText = document.querySelector('.year-input').value;
                }
                document.querySelector('.cvv').onmouseenter = function () {
                    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(-180deg)';
                    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(0deg)';
                }
                document.querySelector('.cvv').onmouseleave = function () {
                    document.querySelector('.front').style.transform = 'perspective(1000px) rotateY(0deg)';
                    document.querySelector('.back').style.transform = 'perspective(1000px) rotateY(180deg)';
                }
                document.querySelector('.cvv').oninput = function () {
                    document.querySelector('.cvv-box').innerText = document.querySelector('.cvv').value;
                }


                //add the space between each 4 numbers

                var cardNumInput = document.querySelector('.cardNum-Input');

                cardNumInput.addEventListener('input', function () {
                    // update the card number info
                    var formattedCardNumber = AddLines(cardNumInput.value);
                    document.querySelector('.cardnum-info').innerText = formattedCardNumber;
                });


                function AddLines(CN) {

                    var formattedCardNumber = '';
                    for (var i = 0; i < CN.length; i++) {

                        if (i % 4 === 0 && i > 0) {
                            formattedCardNumber += ' ';
                        }
                        formattedCardNumber += CN[i];
                    }

                    return formattedCardNumber;
                }



            }, 2000);
        }


    });




    return (
        <div >
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
            <div className="use-all-css">
                <div class="outer-container">
                    <div class="inner-container">
                        <Aside />
                        <div className="use-payment-css">
                            <div class="main-content" style={{ width: '1000px' }}>
                                <div class="content-header">
                                    <h1>Your Payment</h1>
                                    <div class="content-subheader"> Pay with the way you like </div>
                                </div>



                                <div class="container">
                                    <div class="Card-Info">
                                        <div class="front">
                                            <div class="CardImage">
                                                <img src="/lcd/chip.png" alt="visa" />
                                                <img src="/lcd/visa.png" alt="chip" />
                                            </div>
                                            <div class="cardnum-info">################</div>
                                            <div class="flexbox">
                                                <div class="box">
                                                    <span>card holder</span>
                                                    <div class="card-holder-name">Full Name</div>
                                                </div>
                                                <div class="box">
                                                    <span>Expires</span>
                                                    <div class="expiration">
                                                        <span class="exp-month">MM</span>
                                                        <span class="exp-year">YY</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="back">
                                            <div class="stripe"></div>
                                            <div class="box">
                                                <span>CVV</span>
                                                <div class="cvv-box"></div>
                                                <img src="/lcd/visa.png" alt="visa" />
                                            </div>
                                        </div>

                                    </div>
                                    <form action="">
                                        <div class="input-area">
                                            <span>Card Number</span>
                                            <input type="text" maxlength="16" class="cardNum-Input" />

                                        </div>
                                        <div class="input-area">
                                            <span>Card Holder</span>
                                            <input type="text" maxlength="16" class="cardHolder-Input" />

                                        </div>
                                        <div class="flexbox">
                                            <div class="input-area">
                                                <span>Expiration MM</span>
                                                <select name="" id="" class="month-input">
                                                    <option value="month" selected disabled>Month</option>
                                                    <option value="01">January</option>
                                                    <option value="02">February</option>
                                                    <option value="03">March</option>
                                                    <option value="04">April</option>
                                                    <option value="05">May</option>
                                                    <option value="06">June</option>
                                                    <option value="07">July</option>
                                                    <option value="08">August</option>
                                                    <option value="09">September</option>
                                                    <option value="10">October</option>
                                                    <option value="11">November</option>
                                                    <option value="12">December</option>
                                                </select>
                                            </div>
                                            <div class="input-area">
                                                <span>Expiration YY</span>
                                                <select name="" id="" class="year-input">
                                                    <option value="year" selected disabled>Year</option>\
                                                    <option value="/20">2020</option>
                                                    <option value="/21">2021</option>
                                                    <option value="/22">2022</option>
                                                    <option value="/23">2023</option>
                                                    <option value="/24">2024</option>
                                                    <option value="/25">2025</option>
                                                    <option value="/26">2026</option>
                                                    <option value="/27">2027</option>

                                                </select>
                                            </div>
                                            <div class="input-area">
                                                <span>CVV</span>
                                                <input type="text" maxlength="3" class="cvv" />

                                            </div>
                                        </div>
                                        <input type="submit" value="submit" class="submit-btn" />

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default Payment;
