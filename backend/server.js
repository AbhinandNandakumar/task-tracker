const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const DATA = "./data.json";

// Read data from the file
const readData = () => {
   const data = fs.readFileSync(DATA);
   return JSON.parse(data);
};

// Write data to the file
const writeData = (data) => {
   fs.writeFileSync(DATA, JSON.stringify(data, null, 2)); // Use null, 2 for better formatting
};

app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
   res.send("Hello World");
});

// Update todos
app.post("/todos", (req, res) => {
   try {
      const currentData = readData();

      if (!Array.isArray(currentData.checked)) {
         currentData.checked = [];
      }

      const updatedTodos = req.body.todos;

      if (!Array.isArray(updatedTodos)) {
         return res
            .status(400)
            .json({ message: "Invalid data format. 'todos' must be an array." });
      }

      
      const checkedIds = updatedTodos
         .filter((todo) => todo.check) 
         .map((todo) => todo.id); 

      currentData.checked = checkedIds;

      
      writeData(currentData);

      res.status(200).json({
         message: "Todos updated successfully",
         data: currentData,
      });
   } catch (error) {
      console.error("Error updating todos:", error);
      res.status(500).json({ message: "Failed to update todos" });
   }
});


app.post("/add", (req, res) => {
   console.log("POST /add called");
   console.log("Request Body:", req.body); // Log request body

   const { text, id } = req.body;
   if (!text || !id) {
      return res.status(400).json({ message: "Todo text and ID are required" });
   }

   const newTodo = { id, text, check: false };

   try {
      const currentData = readData();

      if (!Array.isArray(currentData.current)) {
         currentData.current = [];
      }
      currentData.current.push(newTodo);

      writeData(currentData);

      console.log("New todo added:", newTodo);

      res.status(200).json({ message: "Todo added successfully", todo: newTodo });
   } catch (error) {
      console.error("Error adding todo:", error);
      res.status(500).json({ message: "Failed to add todo" });
   }
});

app.get("/todos", (req, res) => {
   try {
      const currentData = readData(); // Read data from file
      if (!Array.isArray(currentData.current)) {
         return res.status(404).json({ message: "No todos found" });
      }
      res.status(200).json(currentData.current); // Respond with the current array
   } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ message: "Failed to fetch todos" });
   }
});


app.delete("/delete/:id", (req, res) => {
   const id = parseInt(req.params.id, 10);
   if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
   }

   try {
      const currentData = readData();

      if (!Array.isArray(currentData.current)) {
         return res.status(404).json({ message: "No todos found" });
      }

      // Filter out the todo with the given ID
      const updatedTodos = currentData.current.filter((todo) => todo.id !== id);

      currentData.current = updatedTodos;

      writeData(currentData); // Save updated data back to the file

      res.status(200).json({
         message: "Todo deleted successfully",
         data: updatedTodos,
      });
   } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ message: "Failed to delete todo" });
   }
});




app.listen(PORT, () => {
   console.log(`Server running on ${PORT}`);
});
