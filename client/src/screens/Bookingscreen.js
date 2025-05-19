import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2'
function Bookingscreen({match}) {
  // const { roomid } = useParams();
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const [room, setroom] = useState(null);
  const roomid = match.params.roomid
  const fromdate = moment(match.params.fromdate , 'DD-MM-YYYY')
  const todate = moment(match.params.todate , 'DD-MM-YYYY')

  const totaldays = moment.duration(todate.diff(fromdate)).asDays()+1
  const [totalamount , settotalamount] = useState();
      
  
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setloading(true);
        const data = (await axios.post("/api/rooms/getroombyid", { roomid }))
          .data;
        settotalamount(data.rentperday * totaldays)
        setroom(data);
        setloading(false);
      } catch (error) {
        setloading(false);
        seterror(true);
      }
    };
    fetchRoom();
  }, []);

      async function bookRoom(){
        const bookingDetails = {
    room,
    userid: JSON.parse(localStorage.getItem("currentUser"))._id,
    fromdate,
    todate,
    totalamount,
    totaldays,
  };

  try {
    setloading(true);
    const response = await axios.post("/api/bookings/bookroom", bookingDetails);
    window.location.href = response.data.url; // Redirect to Stripe Checkout page
    setloading(false);
    // Swal.fire('Congratulations' , 'Your Room Has Been Booked Successfully' , 'success')
  } catch (error) {
    setloading(false)
    // console.error("Error creating checkout session", error);
    // alert("Payment failed to start.");
    // Swal.fire('Congratulations' , 'Something went wrong' , 'error')
  }
        

      }


      // async function onToken(token){
      //    console.log(token)
      //    const bookingDetails ={

      //     room ,
      //     userid: JSON.parse(localStorage.getItem('currentUser')),
      //     fromdate,
      //     todate,
      //     totalamount,
      //     totaldays
      //   }

      //   try {
      //     const result = await axios.post('/api/bookings/bookroom' , bookingDetails , token)
      //   } catch (error) {
          
      //   }
      // }
  //      console.log(token);
  // const bookingDetails = {
  //   room,
  //   userid: JSON.parse(localStorage.getItem("currentUser"))._id,
  //   fromdate,
  //   todate,
  //   totalamount,
  //   totaldays,
  //   token,  // <-- this is new!
  // };

//   try {
//     setloading(true);
//     const result = await axios.post("/api/bookings/bookroom", bookingDetails);
//     setloading(false);
//     alert("Payment Success, Room Booked!");
//     window.location.href = "/profile";
//   } catch (error) {
//     setloading(false);
//     alert("Something went wrong");
//   }
// }

  return (
    <div className="m-5">
      {loading ? (
        <Loader/>
      ) : room ?  (
        <div>
          <div className="row justify-content-center mt-5 bs">
            <div className="col-md-5">
              <h1>{room.name}</h1>
              <img src={room.imageurls[0]} className="bigimg" />
            </div>

            <div className="col-md-5">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>Name : {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                  <p>From Date : {match.params.fromdate}</p>
                  <p>To Date : {match.params.todate}</p>
                  <p>Max Count : {room.maxcount}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <h1>Amount</h1>
                <hr />
                <b>
                 <p>Total days : {totaldays}</p>
                <p>Rent per day : {room.rentperday}</p>
                <p>Total amount : {totalamount}</p>
                </b>
              </div>

              <div style={{ float: "right" }}>
              <button className="btn btn-primary" onClick={bookRoom}>Pay Now</button>
                {/* <StripeCheckout
                currency="INR"
                amount={totalamount * 100}
        token={onToken}
        stripeKey="pk_test_51RPHNSH7gJ5jYxUvcBurt9FxpRS1MKmZLato1RRdol1ywzbH63tMAx2JfOQbhmBz4kSoCVapy0wSdubgBFkCfSND005MuZ2dOq">
             <button className="btn btn-primary" onClick={bookRoom}>Pay Now</button>
        </StripeCheckout> */}
              </div>
            </div>
          </div>
        </div> ) : (<Error />)}
    </div>
  );
}

export default Bookingscreen;
