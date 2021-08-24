-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 23. Aug 2020 um 09:01
-- Server-Version: 10.1.44-MariaDB-0ubuntu0.18.04.1
-- PHP-Version: 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `sDaKwoavz4`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `kind`
--

CREATE TABLE `kind` (
  `MNr` int(11) NOT NULL DEFAULT '0',
  `Vorname` varchar(50) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `GebDatum` date NOT NULL DEFAULT '0000-00-00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Daten für Tabelle `kind`
--

INSERT INTO `kind` (`MNr`, `Vorname`, `GebDatum`) VALUES
(100, 'Pia', '2001-08-05'),
(101, 'Benedikt', '2000-07-20'),
(101, 'Heidi', '1998-02-02'),
(101, 'Martin', '1999-07-20'),
(207, 'Gudrun', '1998-06-04'),
(701, 'Patrick', '2001-09-01'),
(711, 'Daniela', '2000-07-17'),
(711, 'Sarah', '2000-08-05'),
(711, 'Toni', '2000-08-05'),
(805, 'Silke', '2001-05-05'),
(805, 'Tobias', '1999-07-06'),
(809, 'Kathrin', '1998-03-04');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitarbeiter`
--

CREATE TABLE `mitarbeiter` (
  `MNr` int(11) NOT NULL DEFAULT '0',
  `Name` varchar(30) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `Vorname` varchar(30) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `Strasse` varchar(30) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `PLZ` varchar(30) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `Ort` varchar(30) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `Telefon` varchar(30) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `Geschlecht` enum('w','m') COLLATE latin1_general_ci NOT NULL DEFAULT 'w',
  `eingestellt` date NOT NULL DEFAULT '0000-00-00'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Daten für Tabelle `mitarbeiter`
--

INSERT INTO `mitarbeiter` (`MNr`, `Name`, `Vorname`, `Strasse`, `PLZ`, `Ort`, `Telefon`, `Geschlecht`, `eingestellt`) VALUES
(100, 'Meier', 'Inge', 'Amselweg 11', '53101', 'Bonn', '0228/124578', 'w', '1995-01-01'),
(101, 'Schneider', 'Ute', 'Hauptstr. 17', '50012', 'Köln', '0221/215211', 'w', '1995-01-01'),
(105, 'Berg', 'Anton', 'Am Funkturm 156', '65203', 'Wiesbaden', '0611/928792', 'm', '1995-09-01'),
(108, 'Wasser', 'Ute', 'Weststr. 20', '52074', 'Aachen', '0241/875554', 'w', '1995-12-01'),
(200, 'Huber', 'Sepp', 'Bodenseestr. 123', '81243', 'München', '089/8744397', 'm', '1996-02-01'),
(207, 'Schmitz', 'Hans', 'Siegburger Str. 51', '50679', 'Köln', '0221/814447', 'm', '1996-05-01'),
(209, 'Schmidt', 'Jürgen', 'Osdorfer Weg 7', '22607', 'Hamburg', '040/899899', 'm', '1996-05-01'),
(611, 'Kammer', 'Ulrike', 'Hauptstr. 171', '52146', 'Würselen', '02405/712217', 'w', '1998-06-01'),
(700, 'Klein', 'Kurth', 'Jollystr. 99', '76137', 'Karlsruhe', '0721/9812124', 'm', '1996-09-15'),
(701, 'Huber', 'Anke', 'Gabelsberger Str. 70', '86199', 'Augsburg', '0821/98666', 'w', '1996-12-01'),
(710, 'Schmidt', 'Beate', 'Klosterstr. 1', '40211', 'Düsseldorf', '0211/363636', 'w', '1997-04-01'),
(711, 'Bauer', 'Klaus', 'Spielhagenstr. 113', '30107', 'Hannover', '0511/833883', 'm', '1997-04-01'),
(800, 'Meier', 'Anton', 'Tiroler Weg 32', '79111', 'Freiburg', '0761/443444', 'm', '1997-06-01'),
(802, 'Meier', 'Doris', 'Hauptstr.32', '98528', 'Suhl', '03681/440044', 'w', '1998-01-01'),
(803, 'Schmidt', 'Barbara', 'Rößlerstr. 33', '09120', 'Chemnitz', '0371/525212', 'w', '1998-01-01'),
(804, 'Walczak', 'Hildegard', 'Altleubnitz 21', '01219', 'Dresden', '0351/788285', 'w', '1998-05-15'),
(805, 'Schmitz', 'Klaus', 'Vogelsanger Str.77', '50666', 'Köln', '0221/561112', 'm', '1998-06-01'),
(806, 'Lausen', 'Werner', 'Münstereifeler Str. 22', '53879', 'Euskirchen', '02251/868657', 'm', '1998-06-01'),
(807, 'Görner', 'Heidrun', 'Waldstr. 97', '51145', 'Köln-Porz', '02203/912778', 'w', '1998-06-01'),
(809, 'Preuß', 'Karl', 'Peter-Paul-Str. 67', '52249', 'Eschweiler', '02403/151515', 'm', '1998-06-01'),
(810, 'Messner', 'Bärbel', 'Levenstr. 88', '50259', 'Pulheim', '02238/980021', 'w', '1998-06-01');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projekt`
--

CREATE TABLE `projekt` (
  `ProjNr` int(11) NOT NULL DEFAULT '0',
  `Bezeichnung` varchar(50) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  `Auftragswert` float(10,2) NOT NULL DEFAULT '0.00',
  `bezahlt` float(10,2) DEFAULT '0.00',
  `Beginn` date NOT NULL DEFAULT '0000-00-00',
  `Ende` date DEFAULT '0000-00-00',
  `Storno` enum('N','Y') COLLATE latin1_general_ci NOT NULL DEFAULT 'N',
  `Leiter` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Daten für Tabelle `projekt`
--

INSERT INTO `projekt` (`ProjNr`, `Bezeichnung`, `Auftragswert`, `bezahlt`, `Beginn`, `Ende`, `Storno`, `Leiter`) VALUES
(77, 'Umzug Stein AG', 50000.00, 12000.00, '1998-06-30', NULL, 'N', 100),
(78, 'Einrichtung Apache-WEB-Server, Moberg GmbH', 8000.00, 0.00, '1998-07-01', '1998-07-15', 'N', 810),
(79, 'Aufbau Intranet, Druckerei Wolff', 30000.00, 7500.00, '1998-09-01', NULL, 'N', 200),
(80, 'Vernetzung, Bau AG', 100000.00, NULL, '1998-07-01', '1998-07-31', 'Y', 800),
(81, 'Vernetzung, Großmann', 24000.00, 5000.00, '1998-07-05', NULL, 'N', 100),
(82, 'DV-Labor, BBS III', 40000.00, 0.00, '1998-08-01', NULL, 'N', 101),
(84, 'Umzug Stadtanzeiger', 180000.00, 30000.00, '1998-08-01', NULL, 'N', 805),
(85, 'Umrüstung Neumann OHG', 12000.00, NULL, '1998-07-01', NULL, 'Y', 700),
(86, 'Linux-Server, Stadtverwaltung Brühl', 15000.00, NULL, '1998-08-10', NULL, 'N', 809),
(87, 'NT-Server, Lacke Hansen', 30000.00, NULL, '1998-06-01', '1998-06-10', 'Y', 803),
(88, 'Adabas-SQL-Server, MTech', 20000.00, 20000.00, '1998-09-01', NULL, 'Y', 804),
(89, 'Office-Schulung, BATIX', 25000.00, NULL, '1998-10-01', NULL, 'N', 803),
(90, 'Umstellung Win95 auf WinNT, Zuckmann', 9500.00, NULL, '1998-10-08', NULL, 'N', 200),
(91, 'Schulung, Naumann & Co.', 5000.00, NULL, '1998-10-15', NULL, 'N', 810);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projektmitarbeiter`
--

CREATE TABLE `projektmitarbeiter` (
  `ProjNr` int(11) NOT NULL DEFAULT '0',
  `MNr` int(11) NOT NULL DEFAULT '0',
  `Zeitanteil` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_general_ci;

--
-- Daten für Tabelle `projektmitarbeiter`
--

INSERT INTO `projektmitarbeiter` (`ProjNr`, `MNr`, `Zeitanteil`) VALUES
(77, 100, 10),
(77, 701, 5),
(77, 805, 20),
(78, 804, 6),
(78, 810, 8),
(79, 200, 10),
(79, 701, 30),
(80, 105, 20),
(80, 108, 5),
(80, 711, 3),
(80, 800, 5),
(80, 803, 5),
(80, 804, 5),
(81, 100, 3),
(81, 806, 10),
(81, 807, 10),
(81, 809, 20),
(82, 101, 5),
(82, 207, 30),
(82, 710, 5),
(84, 108, 5),
(84, 700, 3),
(84, 710, 5),
(85, 700, 35),
(86, 804, 6),
(86, 809, 10),
(87, 803, 10),
(88, 101, 3),
(88, 711, 5),
(88, 804, 15),
(89, 803, 20),
(89, 807, 10),
(90, 200, 5),
(90, 802, 25),
(91, 108, 8),
(91, 800, 12),
(91, 810, 5);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `kind`
--
ALTER TABLE `kind`
  ADD PRIMARY KEY (`MNr`,`Vorname`);

--
-- Indizes für die Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  ADD PRIMARY KEY (`MNr`);

--
-- Indizes für die Tabelle `projekt`
--
ALTER TABLE `projekt`
  ADD PRIMARY KEY (`ProjNr`),
  ADD KEY `I_Leiter` (`Leiter`);

--
-- Indizes für die Tabelle `projektmitarbeiter`
--
ALTER TABLE `projektmitarbeiter`
  ADD PRIMARY KEY (`ProjNr`,`MNr`),
  ADD KEY `I_MNr` (`MNr`);

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `kind`
--
ALTER TABLE `kind`
  ADD CONSTRAINT `0_417` FOREIGN KEY (`MNr`) REFERENCES `mitarbeiter` (`MNr`);

--
-- Constraints der Tabelle `projekt`
--
ALTER TABLE `projekt`
  ADD CONSTRAINT `0_426` FOREIGN KEY (`Leiter`) REFERENCES `mitarbeiter` (`MNr`);

--
-- Constraints der Tabelle `projektmitarbeiter`
--
ALTER TABLE `projektmitarbeiter`
  ADD CONSTRAINT `0_421` FOREIGN KEY (`ProjNr`) REFERENCES `projekt` (`ProjNr`) ON DELETE CASCADE,
  ADD CONSTRAINT `0_430` FOREIGN KEY (`MNr`) REFERENCES `mitarbeiter` (`MNr`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
