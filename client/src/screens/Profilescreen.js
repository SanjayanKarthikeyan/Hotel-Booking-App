import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
// import type { TabsProps } from 'antd';
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from "sweetalert2";
import { Divider, Flex, Tag } from 'antd';
const { TabPane } = Tabs;

function Profilescreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="ml-3 mt-3">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Profile" key="1">
          <h1>My Profile</h1>
          <br />
          <p>
            <b>Name : </b>
            {user.name}
          </p>
          <p>
            <b>Email : </b>
            {user.email}
          </p>
          <p>
            <b>isAdmin : </b>
            {user.isAdmin ? "Yes" : "No"}
          </p>
        </TabPane>
        <TabPane tab="Bookings" key="2">
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Profilescreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [bookings, setbookings] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setloading(true);
        const data = (
          await axios.post("/api/bookings/getbookingsbyuserid", {
            userid: user._id,
          })
        ).data;
        console.log(data);
        setbookings(data);
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
        seterror(error);
      }
    };

    fetchBookings();
  }, []);

  async function cancelBooking(bookingid, roomid) {
    try {
      setloading(true);
      const result = await (
        await axios.post("/api/bookings/cancelbooking", { bookingid, roomid })
      ).data;
      console.log(result);
      setloading(false);
      Swal.fire(
        "Congratulations",
        "Your booking has been cancelled",
        "success"
      ).then((result) => {
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
      setloading(false);
      Swal.fire("Oops", "Something went wrong", "error");
    }
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          {loading && <Loader />}
          {bookings &&
            bookings.map((booking) => {
              return (
                <div className="bs">
                  <h1>{booking.room}</h1>
                  <p>
                    <b>BookingId : </b> {booking._id}
                  </p>
                  <p>
                    <b>CheckIn : </b>
                    {booking.fromdate}
                  </p>
                  <p>
                    <b>CheckOut : </b>
                    {booking.todate}
                  </p>
                  <p>
                    <b>Amount : </b>
                    {booking.totalamount}
                  </p>
                  <p>
                    <b>Status : </b>
                    {booking.status=='cancelled' ? ( <Tag color="red">CANCELLED</Tag>) : (<Tag color="green">CONFIRMED</Tag>)}
                  </p>

                  {booking.status !== "cancelled" && (
                    <div className="text-right">
                      <button
                        class="btn btn-primary"
                        onClick={() =>
                          cancelBooking(booking._id, booking.roomid)
                        }
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

// export function MyBookings() {
// const user = JSON.parse(localStorage.getItem("currentUser"))
//     useEffect(async() => {
//        try {
//         const rooms = (await axios.post('/api/bookings/getbookingsbyuserid' , {userid : user._id})).data
//        console.log(rooms)
//        } catch (error) {
//         console.log(error)
//        }
//     }, [])

//   return (
//     <div>
//         <h1>My Bookings</h1>
//     </div>
//   )
// }
