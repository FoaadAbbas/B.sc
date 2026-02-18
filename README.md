# Nand2Tetris - From Logic Gates to OS (Jack, Assembly, VM)

**This repository contains a full implementation of the Nand2Tetris course projects, alongside custom homework assignments focusing on extended hardware capabilities.**

The project demonstrates the construction of a general-purpose computer system from the ground up, starting from elementary NAND gates and culminating in a high-level object-oriented operating system.

---

## 📂 Repository Structure

### 🎓 Course Extensions (Homework)
Unlike the standard curriculum, this repository includes custom hardware implementations often required in advanced architecture courses (e.g., Braude College):

* **HW1 - Extended Logic & Shifting:**
    * `ALUshr`: An enhanced ALU capable of bitwise shifting operations.
    * `Mux16Way16`: A 16-way 16-bit multiplexer implementation.
    * `Shr1`, `Shr2`, `Shr4`, `Shr8`: Barrel shifter components for optimized bit manipulation.
* **HW2 - Advanced Chips:**
    * Additional logic gates and optimized hardware components.
* **HW3 - Sequential Logic:**
    * `PCUpDown`: An advanced Program Counter with up/down counting capabilities.

### 🧱 Core Nand2Tetris Projects (`nand2tetris/projects`)
Full implementation of the 12 standard modules:

1.  **Boolean Logic:** Construction of basic gates (And, Or, Xor, Mux, DMux).
2.  **Boolean Arithmetic:** Adder chips and the standard ALU.
3.  **Sequential Logic:** Memory units (RAM8, RAM64, RAM4K, PC).
4.  **Machine Language:** Assembly programs (Mult, Fill) for the Hack platform.
5.  **Computer Architecture:** The CPU and Computer chip connecting Memory and ROM.
6.  **Assembler:** A custom Assembler converting `.asm` to `.hack` binary code.
7.  **VM I:** Stack arithmetic implementation.
8.  **VM II:** Program control and function calls.
9.  **High-Level Language:** "Space Invaders" / "Pong" game written in **Jack**.
10. **Compiler I:** Syntax Analysis & Tokenizing.
11. **Compiler II:** Code Generation.
12. **Operating System:** A standard library (Math, Screen, Keyboard, String, Array, Sys) implemented in Jack.

---

## 🛠️ Tools & Usage

The `nand2tetris/tools` directory contains the official software suite required to run simulations:

* **HardwareSimulator:** For testing HDL files (Chips).
* **CPUEmulator:** For running Assembly and Machine Code.
* **VMEmulator:** For testing Virtual Machine code.
* **JackCompiler:** For compiling high-level Jack code.

### Running a Test
To test the custom ALU with Shift capabilities:
1.  Open the **HardwareSimulator**.
2.  Load the `HW1/ALUshr.hdl` file.
3.  Load the corresponding test script `HW1/ALUshr.tst`.
4.  Run the simulation to verify `ALUshr.out` matches `ALUshr.cmp`.

---

## 🚀 Key Highlights

* **Full Stack Implementation:** Covers everything from hardware logic gates to software compilers and OS.
* **Optimized Shifters:** Includes a Logarithmic Barrel Shifter implementation (`VaribaleShr`) for O(log n) shifting complexity.
* **Custom Assembly:** Contains optimized assembly routines for mathematical operations.

---

## 📜 License

This project is based on the *Elements of Computing Systems* (Nand2Tetris) course.
