const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const moment = require("moment");
const stripe = require("stripe")("sk_test_51RPHNSH7gJ5jYxUv4sjM33OKEvfeqGJhSsLgJT40Of1Fc02D2Nmv30y0A583OPfodp4S58FD4KU1rMyxtWXwvvwX00b0lWTA0n"); // 🔑 use your real secret key
// router.post("/bookroom", async (req, res) => {
//   const { room, userid, fromdate, todate, totalamount, totaldays } = req.body;

//   try {
//     const newbooking = new Booking({
//       room: room.name,
//       roomid: room._id,
//       userid,
//       fromdate: moment(fromdate).format("DD-MM-YYYY"),
//       todate: moment(todate).format("DD-MM-YYYY"),
//       totalamount,
//       totaldays,
//       transactionId: "1234",
//     });

//     const booking = await newbooking.save();

//     const roomtemp = await Room.findOne({ _id: room._id });

//     roomtemp.currentbookings.push({
//       bookingid: booking._id,
//       fromdate: moment(fromdate).format("DD-MM-YYYY"),
//       todate: moment(todate).format("DD-MM-YYYY"),
//       userid : userid,
//       status : booking.status
//     });

//     await roomtemp.save()

//     res.send("Room Booked Successfully");
//   } catch (error) {
//     return res.status(400).json({ error });
//   }
// });

router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: room.name,
            },
            unit_amount: totalamount * 100, // in paise
          },
          quantity: 1,
        },
      ],
      
      mode: "payment",
      success_url: `http://localhost:3000/profile`, // change for deployment
      cancel_url: `http://localhost:3000/cancel`,
      metadata: {
        room: room.name,
      roomid: room._id,
      userid,
      fromdate: moment(fromdate).format("DD-MM-YYYY"),
      todate: moment(todate).format("DD-MM-YYYY"),
      totalamount,
      totaldays,
      },
    });
    

    res.send({ url: session.url });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }

   try {
    const newbooking = new Booking({
      room: room.name,
      roomid: room._id,
      userid,
      fromdate: moment(fromdate).format("DD-MM-YYYY"),
      todate: moment(todate).format("DD-MM-YYYY"),
      totalamount,
      totaldays,
      transactionId: "1234",
    });

    const booking = await newbooking.save();

    const roomtemp = await Room.findOne({ _id: room._id });

    roomtemp.currentbookings.push({
      bookingid: booking._id,
      fromdate: moment(fromdate).format("DD-MM-YYYY"),
      todate: moment(todate).format("DD-MM-YYYY"),
      userid : userid,
      status : booking.status
    });

    await roomtemp.save()

    res.send("Room Booked Successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/getbookingsbyuserid" , async(req,res) => {
  
  const userid = req.body.userid

  try {
    const bookings = await Booking.find({userid : userid})
    res.send(bookings)
  } catch (error) {
    return res.status(400).json({ error })
  }

});

router.post("/cancelbooking" , async(req, res) => {

  const {bookingid , roomid} = req.body

  try {
    const bookingitem = await Booking.findOne({_id : bookingid})
    bookingitem.status = 'cancelled'
    await bookingitem.save()
    const room = await Room.findOne({_id : roomid})
    const bookings = room.currentbookings
    const temp = bookings.filter(booking => booking.bookingid.toString()!==bookingid)
    room.currentbookings = temp
    await room.save()

    res.send('Your booking has been cancelled successfully')
  } catch (error) {
    return res.status(400).json({ error })
  }

});

module.exports = router;
