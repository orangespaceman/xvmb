-- phpMyAdmin SQL Dump
-- version 3.2.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 01, 2010 at 02:19 PM
-- Server version: 5.1.44
-- PHP Version: 5.2.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `xvmb`
--

-- --------------------------------------------------------

--
-- Table structure for table `xvmb`
--

CREATE TABLE `xvmb` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `who` varchar(50) NOT NULL,
  `what` varchar(140) NOT NULL,
  `where` varchar(50) NOT NULL,
  `when` varchar(50) NOT NULL,
  `ip` varchar(20) NOT NULL,
  `islive` tinyint(1) NOT NULL,
  `dateadded` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=28 ;

--
-- Dumping data for table `xvmb`
--

INSERT INTO `xvmb` VALUES(15, 'MC', 'Diarised Touchpoint', 'Standup meeting', 'April 2010', '192.168.0.8', 1, '2010-07-22 15:09:19');
INSERT INTO `xvmb` VALUES(16, 'MC', 'Waterfall Approach', 'Meeting room', 'March 2010', '192.168.0.8', 1, '2010-07-22 15:09:44');
INSERT INTO `xvmb` VALUES(14, 'MC', 'Based on your project velocity, the budget should be a simple calculation.', 'email', 'March 2010', '192.168.0.7', 1, '2010-07-22 14:22:56');
INSERT INTO `xvmb` VALUES(13, 'Big Al', '"Agile" process will only work if the client is willing to move forward with some unknowns and is willing to be a participant in the proce', 'email', 'March 2010', '192.168.0.7', 1, '2010-07-22 14:21:47');
INSERT INTO `xvmb` VALUES(12, 'MC', 'I batch process messages ... turning messages into next actions.', 'Online interview', 'April 2010', '192.168.0.7', 1, '2010-07-22 14:19:31');
INSERT INTO `xvmb` VALUES(11, 'MC', 'I''m certified in both PRINCE2 and SCRUM  project management methodologies. I use a hybrid of both methodologies...', 'Online interview', 'April 2010', '192.168.0.7', 1, '2010-07-22 14:18:17');
INSERT INTO `xvmb` VALUES(9, 'A. Client', 'I don''t want to throw the cat among the pigeons on this, guys...', 'Via email', 'June 2010', '192.168.0.8', 1, '2010-07-22 14:09:02');
INSERT INTO `xvmb` VALUES(10, 'MC', 'I treat people like humans', 'Online interview', 'April 2010', '192.168.0.7', 1, '2010-07-22 14:17:03');
INSERT INTO `xvmb` VALUES(8, 'KB', 'Is anyone able to coat this up today?', 'From her mobile', 'July 2010', '192.168.0.8', 1, '2010-07-22 14:02:00');
INSERT INTO `xvmb` VALUES(17, 'Anon client', 'Are you ok to have a sit down in half an hour to touch base on the site?', 'Ade''s freelance days', '2008', '192.168.0.8', 1, '2010-07-22 15:28:38');
INSERT INTO `xvmb` VALUES(18, 'PxG', 'This in turn will spark media interest and cause us to be quoted more, leading to an escalating media quote video viral cycle of quotations.', 'Avast Email', 'July 2010', '192.168.0.7', 1, '2010-07-23 17:36:06');
INSERT INTO `xvmb` VALUES(19, 'Pete Griffin', 'Which one\\''s Scrubs?', 'On tv.', 'A while ago.', '192.168.0.88', 1, '2010-07-23 17:38:21');
INSERT INTO `xvmb` VALUES(20, 'Mr A.G. Gressive', 'Insert passive aggressive note here.', 'Everywhere', 'Soon', '192.168.0.88', 1, '2010-07-23 17:40:42');
INSERT INTO `xvmb` VALUES(21, 'Project Manager Graeme', 'We need to ammend the copy on the call to action on the SAP pop-up.', 'Pirate Office', 'July 2010', '192.168.0.13', 1, '2010-07-27 10:13:26');
INSERT INTO `xvmb` VALUES(22, 'anon.', 'Social Media - Writing loads of expensive documentation, setting up a blog, twitter and facebook account and talking about google analytics', 'Everywhere', 'The last few years', '192.168.0.7', 1, '2010-08-02 16:14:55');
INSERT INTO `xvmb` VALUES(23, 'Ade', 'tonight is my amber window', 'IM', 'Just now', '192.168.0.7', 1, '2010-08-03 15:59:28');
INSERT INTO `xvmb` VALUES(24, 'MP', 'PHP6 RSS Databases', 'In his head', 'A few years ago', '192.168.0.7', 1, '2010-08-04 10:06:48');
INSERT INTO `xvmb` VALUES(25, 'Eric Schmidt', '...people need to get ready for major technology disruption, fast. ', 'Tech Bullshit conference', 'August 2010', '192.168.0.13', 1, '2010-08-10 14:01:48');
INSERT INTO `xvmb` VALUES(26, 'KB', 'It would be great to get some boilerplates in place for this', 'Pirata HQ', 'August 2010', '192.168.0.8', 1, '2010-08-25 11:03:05');
INSERT INTO `xvmb` VALUES(27, 'NW', 'Put a stake in the ground', 'in my ear', 'Just now', '192.168.0.7', 1, '2010-08-26 10:56:35');
