-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 24, 2026 at 04:11 AM
-- Server version: 10.6.24-MariaDB-cll-lve
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact_us`
--

CREATE TABLE `contact_us` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `subject` varchar(500) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `contact_us`
--

INSERT INTO `contact_us` (`id`, `name`, `email`, `subject`, `message`, `created_at`) VALUES
(5, 'Arjun Kushwaha', 'arjun.pche@gmail.com', 'FTP is disabled', 'Test Message', '2025-11-14 02:59:13'),
(6, 'ARJUN KUSHWAHA', 'arjunkushwahaji3@gmail.com', 'Contact Fomr', '23345', '2025-11-14 07:29:43'),
(12, 'Arjun Kushwaha', 'arjun.pche@gmail.com', 'FTP is disabled', 'My FTP is Disabled please help', '2025-11-14 13:20:19'),
(13, 'Birender', 'outsourceatact@gmail.com', 'ITR Filing', 'I want to file ITR for AY 2025-26 and also charges.', '2025-11-14 13:49:03'),
(14, 'Yash ', 'Yash@gmail.com', 'Audit', 'Please contact ASAP', '2025-11-20 05:37:11');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `assigned_user_id` int(11) NOT NULL,
  `priority` enum('high','medium','low') DEFAULT 'medium',
  `due_date` date NOT NULL,
  `status` enum('pending','in_progress','completed','closed') DEFAULT 'pending',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_files`
--

CREATE TABLE `task_files` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `file_size` int(11) DEFAULT NULL,
  `uploaded_by` int(11) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_updates`
--

CREATE TABLE `task_updates` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `old_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_users`
--

CREATE TABLE `task_users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `designation` varchar(150) NOT NULL,
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `task_users`
--

INSERT INTO `task_users` (`id`, `name`, `email`, `password`, `role`, `designation`, `status`, `created_at`) VALUES
(1, 'Arjun Kushwaha', 'arjun.pche@gmail.com', '$2y$10$b/DBlXhGXEoD0Sbb4MTIpuoLdpx/c043XAMfgRwRgx1Gjla.UeRCq', 'admin', 'Developer', 1, '2025-11-14 09:11:43'),
(3, 'Arjun Kushwaha', 'arjun.pche2@gmail.com', '$2y$10$4MgH3ynbqATxL36W5QTGsOuXprlKZQOk8SvGkfEbxHTFdpjmkLgy2', 'admin', 'Developer', 1, '2025-11-14 09:26:43'),
(5, 'Arjun Kushwaha', 'arjun.pche3@gmail.com', '$2y$10$Wh01iFhuUWZEGB0wWTXIVuB6OpXb3V.UBWeg7qEDnj8ZugopkLt0u', 'admin', 'Developer', 1, '2025-11-14 09:28:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`) VALUES
(6, 'Arjun Kushwaha', 'arjun.pche@gmail.com', '$2y$10$4kL8Yoc2cBQD/cdyvCcUa.W4TUd7KFwBQfPftSaHzyIlbUWozHlya', 'admin', '2025-11-13 22:36:47'),
(9, 'ronik Vats', 'ronikvats@gmail.com', '$2y$10$1BJxkFtahXHvm74EgmSLL.pBj5xS.R.P194473SaQ3pw7C8PdNtTa', 'admin', '2025-11-14 00:44:54'),
(19, 'Subhash Singh', 'pskanodia@gmail.com', '$2y$10$El9ey7i7C8S7TWlgK9KtceTOjRT.XZyGU1G6mwIk9.VOPg8G7AGEy', 'admin', '2025-11-14 06:27:41'),
(21, 'Shweta', 'shweta@gmail.com', '$2y$10$eWBWYALrBLoq.50C7Lsh7.KJmJ0so9KXfzxwDmqK197NQm5KGUsAm', 'user', '2025-11-17 03:00:48'),
(22, 'Supriya', 'supriya@gmail.com', '$2y$10$mh/JZPIHQ6owIqK7Ix2YoOki6ZAsXOsWIX4pnU3anptDGAGEa1bPy', 'admin', '2025-11-17 03:01:44'),
(23, 'Swatii', 'swati@gmail.com', '$2y$10$GKglpZdJA0xGhLNlQcsTVO9omouaNrJ0dg2Rmn.psiboy/qEoRlKW', 'user', '2025-11-17 03:02:29'),
(33, 'Hunny', 'hunny@gmail.com', '$2y$10$xzcgUKBNByw0GtRaP/i2J.QiLPXfaCi4vjxtSbcA08OOOGFep0ag6', 'admin', '2025-11-19 22:35:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_us`
--
ALTER TABLE `contact_us`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assigned_user_id` (`assigned_user_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `task_files`
--
ALTER TABLE `task_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `task_updates`
--
ALTER TABLE `task_updates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `task_users`
--
ALTER TABLE `task_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact_us`
--
ALTER TABLE `contact_us`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_files`
--
ALTER TABLE `task_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_updates`
--
ALTER TABLE `task_updates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_users`
--
ALTER TABLE `task_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`assigned_user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `task_files`
--
ALTER TABLE `task_files`
  ADD CONSTRAINT `task_files_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`),
  ADD CONSTRAINT `task_files_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `task_updates`
--
ALTER TABLE `task_updates`
  ADD CONSTRAINT `task_updates_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`),
  ADD CONSTRAINT `task_updates_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
