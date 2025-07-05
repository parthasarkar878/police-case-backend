import express from "express";
import jwt from "jsonwebtoken";
import Case from "../models/Case.js";

const router = express.Router();

// Middleware to check auth
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

// Create new case
router.post("/add", verifyToken, async (req, res) => {
  try {
    const newCase = new Case({
      ...req.body,
      createdBy: req.user.userId
    });
    await newCase.save();
    res.json({ msg: "Case created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all cases (HQ or Thana)
router.get("/all", verifyToken, async (req, res) => {
  try {
    let cases;
    if (req.user.role === "hq") {
      cases = await Case.find();
    } else if (req.user.role === "thana") {
      cases = await Case.find({ createdBy: req.user.userId });
    } else {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    res.json(cases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update progress + extended fields
router.post("/progress/:id", verifyToken, async (req, res) => {
  try {
    const caseId = req.params.id;
    const update = {
      updateDate: new Date(),
      updateText: req.body.updateText,
    };
    const caseDoc = await Case.findById(caseId);
    caseDoc.progressUpdates.push(update);

    if (req.body.status) caseDoc.status = req.body.status;
    if (req.body.complaintDetails) caseDoc.complaintDetails = req.body.complaintDetails;
    if (req.body.typeOfCase) caseDoc.typeOfCase = req.body.typeOfCase;
    if (req.body.ioName) caseDoc.ioName = req.body.ioName;
    if (req.body.ioContact) caseDoc.ioContact = req.body.ioContact;
    if (req.body.accusedDetails) caseDoc.accusedDetails = req.body.accusedDetails;
    if (req.body.chargeSheetDate) caseDoc.chargeSheetDate = req.body.chargeSheetDate;

    await caseDoc.save();
    res.json({ msg: "Progress and details updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Test ping
router.get("/ping", (req, res) => {
  res.send("Case routes working!");
});

export default router;
