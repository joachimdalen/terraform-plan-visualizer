<div align="center">

# 🗺️ Terraform Plan Visualizer

### Interactive visual graph representation of your Terraform infrastructure changes

Transform complex Terraform plan files into intuitive, interactive visual graphs. Understand your infrastructure changes at a glance with a beautiful node-based visualization.

![Terraform Plan Visualizer Screenshot](./docs/screenshot.jpeg)

[![License](https://img.shields.io/github/license/joachimdalen/terraform-plan-visualizer)](LICENSE)
[![Version](https://img.shields.io/github/package-json/v/joachimdalen/terraform-plan-visualizer)](package.json)

[Features](#features) • [Getting Started](#getting-started) • [Usage](#usage) • [Development](#development)

</div>

---

## ✨ Features

- **🎨 Interactive Graph Visualization** - Explore your infrastructure with an intuitive, zoomable node-based interface powered by ReactFlow
- **📦 Resource & Module Support** - Visualize resources, data sources, and modules with distinct node types
- **🔄 Change Detection** - Instantly identify which resources will be created, updated, or destroyed
- **🏷️ Provider Icons** - Quick identification with provider-specific icons and labels
- **🔗 Relationship Mapping** - Understand dependencies and connections between resources
- **⚙️ Smart Layouts** - Automatic graph formatting using ELK.js for optimal visualization
- **💾 Export Options** - Download your infrastructure graph as PNG for documentation and presentations
- **🎯 Interactive Node Details** - Click any node to view detailed information in a side panel
- **🔍 Fit View & Navigation** - Easy-to-use controls for navigating large infrastructure plans
- **📋 JSON Plan File Support** - Load standard Terraform JSON plan files directly

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Terraform** CLI (to generate plan files)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/joachimdalen/terraform-plan-visualizer.git
   cd terraform-plan-visualizer
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**

   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Generating a Terraform Plan File

To visualize your infrastructure, you first need to generate a Terraform plan in JSON format:

1. **Create a Terraform plan**

   ```bash
   terraform plan -out=tfplan.binary
   ```

2. **Convert the binary plan to JSON**

   ```bash
   terraform show -json tfplan.binary > plan.json
   ```

3. **Load the file**

   Click the "Load plan" button in the application and select your `plan.json` file.

### Quick Usage

Once the application is running:

1. Click **"Load plan"** button
2. Select your JSON plan file
3. Explore the graph - zoom, pan, and click nodes for details
4. Use **"Reformat"** to reorganize the layout
5. Use **"Fit view"** to center and scale the entire graph
6. Export your visualization using the download button
