import express from "express";
import cors from "cors";
import pdf from "html-pdf";

import HTMLDocument from "./html-document";

const myDocument = new HTMLDocument();

myDocument.appendStyles({
    "*, *::before, *::after": {
        margin: "0px",
        padding: "0px",
    },
    div: {
        width: "200px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "red",
        margin: "50px 50px",
        padding: "20px",
        borderRadius: "15px",
    },
});

myDocument.appendElement("body", "div", (newElement) => {
    newElement.innerHTML = "Hello World";
    newElement.style.color = "orange";
    newElement.id = "1";
});

myDocument.appendElement("#1", "h1", (newElem) => {
    newElem.style.padding = "5px";
    newElem.style.color = "blue";
    newElem.innerHTML = "This is Header 1";
    newElem.id = "2";
});

myDocument.appendElement("#2", "img", (img) => {
    img.src = "http://localhost:5000/images/kkk.jpg";
    img.style.width = "40px";
});

console.log(myDocument.documentElement.outerHTML);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/images", express.static("images"));

// pdf.create(document.documentElement.innerHTML, { width: "58mm", height: "100mm", border: "0mm", type: "pdf", quality: "1" }).toFile("test.pdf", (err, res) => {
//     console.log("Printed!");
// });

app.get("/", (req, res) => {
    res.send(myDocument.documentElement.outerHTML);
});

app.listen(5000, () => {
    console.log("Server is running on port:", 5000);
});
