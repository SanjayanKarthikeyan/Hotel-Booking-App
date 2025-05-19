import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import { DatePicker, Space } from "antd";
const { RangePicker } = DatePicker;
function Homescreen(params) {
  const [rooms, setrooms] = useState([]);
  const [loading, setloading] = useState();
  const [error, seterror] = useState();
  const [fromdate, setfromdate] = useState();
  const [todate, settodate] = useState();
  const [duplicaterooms, setduplicaterooms] = useState([]);

  const[searchkey , setsearchkey] = useState('')
  const[type , settype] = useState('all')

  useEffect(() => {
    async function fetchData() {
      try {
        setloading(true);
        const data = (await axios.get("/api/rooms/getallrooms")).data;

        setrooms(data);
        setduplicaterooms(data);
        setloading(false);
      } catch (error) {
        seterror(true);
        console.error(error);
        setloading(false);
      }
    }

    fetchData();
  }, []);

  // function filterByDate(dates) {
  //   // console.log((dates[0]).format('DD-MM-YYYY'))
  //   // console.log((dates[1]).format('DD-MM-YYYY'))
  //   setfromdate(dates[0].format("DD-MM-YYYY"));
  //   settodate(dates[1].format("DD-MM-YYYY"));

  //   var temprooms = [];
  //   var availability = false;
  //   for (const room of duplicaterooms) {
  //     if (room.currentbookings.length > 0) {
  //       for ( const booking of room.currentbookings) {
  //         if (
  //           !moment((dates[0]).format("DD-MM-YYYY")).isBetween(
  //             booking.fromdate,
  //             booking.todate
  //           ) &&
  //           !moment((dates[1]).format("DD-MM-YYYY")).isBetween(
  //             booking.fromdate,
  //             booking.todate
  //           )
  //         ) {
  //           if (
  //             moment(dates[0]).format('DD-MM-YYYY') !== booking.fromdate &&
  //             moment(dates[0]).format('DD-MM-YYYY') !== booking.todate &&
  //             moment(dates[1]).format('DD-MM-YYYY') !== booking.fromdate &&
  //             moment(dates[1]).format('DD-MM-YYYY') !== booking.todate
  //           ) {
  //             availability = true;
  //           }
  //         }
  //       }
  //     }

  //     if(availability == true || room.currentbookings.length==0)
  //     {
  //       temprooms.push(room)
  //     }

  //     setrooms(temprooms)

  //   }
  // }

function filterByDate(dates) {
    if (!dates || dates.length < 2) {
        console.error("Invalid date range:", dates);
        return;
    }

    const startDate = dates[0]; // Keep as Moment object
    const endDate = dates[1]; // Keep as Moment object

    setfromdate(startDate.format('DD-MM-YYYY'));
    settodate(endDate.format('DD-MM-YYYY'));

    const filteredRooms = duplicaterooms.filter(room => {
        if (room.currentbookings.length === 0) {
            console.log("Room has no bookings:", room);
            return true; // Available if no bookings
        }

        return room.currentbookings.every(booking => {
            const bookingStart = moment(booking.fromdate, 'DD-MM-YYYY');
            const bookingEnd = moment(booking.todate, 'DD-MM-YYYY');

            const isAvailable =
                endDate.isBefore(bookingStart) || startDate.isAfter(bookingEnd);

            console.log(
                `Room: ${room.name}, Available: ${isAvailable}`,
                `Booking Start: ${bookingStart.format('DD-MM-YYYY')}, Booking End: ${bookingEnd.format('DD-MM-YYYY')}`
            );

            return isAvailable;
        });
    });

    console.log("Filtered Rooms:", filteredRooms);
    setrooms(filteredRooms);
}

function filterBySearch(){

  const temprooms = duplicaterooms.filter(room=>room.name.toLowerCase().includes(searchkey.toLowerCase()))
  setrooms(temprooms)

}

function filterByType(e){
    settype(e)
    if(e!=='all'){
      const temprooms = duplicaterooms.filter(room=>room.type.toLowerCase()==e.toLowerCase())
    setrooms(temprooms)
    }
    else{
      setrooms(duplicaterooms)
    }
}

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>

                <div className="col-md-5">
                  <input type="text" className="form-control" placeholder="Search Rooms" value={searchkey} onChange={(e)=>{setsearchkey(e.target.value)}} onKeyUp={filterBySearch}/>
                </div>

              <div className="col-md-3">
                <select className="form-control" value={type} onChange={(e)=>{filterByType(e.target.value)}}>
                <option value='all'>All</option>
                <option value='deluxe'>Deluxe</option>
                <option value='non-deluxe'>Non-Deluxe</option>
              </select>
              </div>

      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : (
          rooms.map((room) => {
            return (
              <div className="col-md-9 mt-2">
                <Room room={room} fromdate={fromdate} todate={todate} />
              </div>
            );
          })
        ) }
      </div>
    </div>
  );
}

export default Homescreen;
