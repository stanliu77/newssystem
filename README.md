# News Management System

## Overview

This is a comprehensive news management system built with React. The project includes various functionalities that demonstrate the use of modern web development practices.

## Key Features

- **User Authentication and Authorization**: Secure login and role-based access control.
- **Dynamic Routing**: Implemented using React Router for seamless navigation.
- **State Management**: Utilized Redux for global state management.
- **News Management**: Features for adding, editing, deleting, and categorizing news articles.
- **Data Visualization**: Integrated ECharts for displaying news statistics with bar and pie charts.
- **Responsive Design**: Ensured compatibility across various PC screen resolutions using CSS and Ant Design components.

## Technologies Used

- React: For building the user interface.
- Redux: For state management.
- Redux Thunk: For handling asynchronous actions.
- React Router: For routing.
- Axios: For making API requests.
- Ant Design: For UI components.
- ECharts: For data visualization.
- Lodash: For utility functions.

## Installation and Setup

To run this project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/stanliu77/news-management-system.git
    cd news-management-system
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start the JSON Server**:
    ```bash
    npx json-server --watch db/db.json --port 5000
    ```

4. **Run the development server**:
    ```bash
    npm start
    ```

5. **Open your browser and navigate to**:
    ```
    http://localhost:3000
    ```
6.**Use superadmin account log in**:
   admin:123456
   
## Project Structure

- **src/components**: Reusable UI components like `SideMenu`, `TopHeader`, etc.
- **src/views**: Different views like `Login`, `News`, `NewsSandbox`, etc.
- **src/redux**: Redux setup including store configuration and reducers.

## Contributing

Feel free to fork this repository and submit pull requests. Any contributions are greatly appreciated!

## License

This project is licensed under the MIT License.
