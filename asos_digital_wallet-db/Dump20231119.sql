-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: digiwalletdb
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `number` varchar(200) NOT NULL,
  `expirationDate` varchar(200) NOT NULL,
  `nameOnCard` varchar(200) NOT NULL,
  `CVV` varchar(200) NOT NULL,
  `type` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (9,NULL,'$2b$08$NCetQXUg5UYn4X0v88BzQ.F.lGeggGoO5nJpSguZFbjXetM0V5ZL.','$2b$08$6ZU19cmHnbID/cqK9au69eVl5lSxQyrwoOKV5TglMxeYgI5Y3JK2S','$2b$08$Lp1G/lJRsYRCgiLyiPYvY.D5yGoqpGYL.k2NG10xl97FJsJRdUL62','$2b$08$mlK4yb08FLjpem/B3S7Ceeh14ZqxCUN2z3a0y2n4ZKC4534nAo7sy','$2b$08$2wVu3CjJ9m3sTmMVRstTDeKEAiBvcPENh6Ir0TlU0GqgwJdBdOlOC'),(10,NULL,'$2b$08$Q/ENKf9wM0AeOKmv/xZ.muM46JOw0buhdJcJ5PckXPvLdv7Y9G3SO','$2b$08$J8gNA5Cc8cTeFQUbmJsRVONmY8VemQ.WDMhP.UihO5KPf6pFPyPLK','$2b$08$EEvEx21SljuCTBe.N3YkOu47s9uc9l55qiGBOTsjmuqoKohoIQgpG','$2b$08$WpDmAo905f77Qk.vb.WjNuQX7sshvby3rBGyrmUZjjM6.MTi8H0si','$2b$08$TxW7EHKmISA5BZgWwTbzFepwKR6YL/.ausHT3.d6Wakju0mn5ZFaO'),(11,NULL,'$2b$08$oY5xPLc0Qh1URVLtjjNQU.hT40YscyYefYmgLpa6TAHTty44lIR0G','$2b$08$ieFbFaoCnFZgtkHJBD1je.OT.eGuU5wZKB4z3jWkHaM.xENk2VQnS','$2b$08$ob6V7UZK.35VQPhPbuFmxOBP3GGPo4II17.MURP3xyykvEWD1Uv8W','$2b$08$y3qzpB1/Aof.B24knyVNXeMp3u4i82mJFV57prwd7qkLMrVzPH03u','$2b$08$S73MFD6ibHA3Hm5M0smWPemXztabN4XRzmw7W/zLEBgVK5D.F/lvO'),(12,14,'$2b$08$a3MI0YzVvlopZcwbVikXw.yq8IjM35WqMNiTTm56yLSjRSfYOhk.W','$2b$08$GXFkGbHTM06WoOfjyxtiLuJEQgmGEwGAIwT5vG9CSSheYkDOdMGo.','$2b$08$jwBCRNsYDYU.kL/CDiPn2ezZpd09ksbzC8eI3JpqU0J7O1LlEYE/2','$2b$08$GBkANTZGHVVAemF2P/lWo.oaH/.TTCG.pwxknXVrvuYNI6A/ish.u','$2b$08$BVXs.soT28WLAMtAXpInLOsN9DILtMUzxSzfIPFU3xDW5/D9KE2Pi'),(13,14,'','','','',''),(14,14,'U2FsdGVkX194GAkjNtKIasgQJ9AAERKQU2sWLDjJ0Ik=','U2FsdGVkX1+2KNvaR2MW8hUA5ovlIly+Mhv1yLXRoho=','U2FsdGVkX19O2GNkZ+38AY5V9Vq4u5B5svkfAwKZt0o=','U2FsdGVkX1+lSzNzSMl1gqkMJuKl4BkGhR8p8BhDbBU=','U2FsdGVkX1/ga21fqgwoG+XvEn8FoD34l4Q1UTacdDA='),(15,14,'U2FsdGVkX1/+5LN2jW05N+9u+MKKnH9ugmOiLUKh03E=','U2FsdGVkX19cV8rsek6DAbSgeaywLvo/WV/OSE9Qj1o=','U2FsdGVkX1/kzKB1jHI0SNMmoo++SILAA2jg20hPhCs=','U2FsdGVkX19HnmhjiXYauiShbowneDcLsrunCVbQ4p0=','U2FsdGVkX18j6fk28pDwIxbi8IjvgM6pLXHY04YEmII='),(16,14,'U2FsdGVkX1+OZG2ZHKB/fzv2rLgtiWiiDVFpM2BW9Oo=','U2FsdGVkX1+JCIZCeS9m4Sll5T++MKqsSEYHhCseLzQ=','U2FsdGVkX19achEZYjqUNhKq3UILWx5D6jESnIdaUTU=','U2FsdGVkX1/SNwQwZYikem5gRU0o1Zz+88CVWxn6Yq8=','U2FsdGVkX1/Xkosn2RaVyvMX/gYkO1BsOShBlOGUsTA=');
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId1` int NOT NULL,
  `userId2` int DEFAULT NULL,
  `transType` varchar(45) NOT NULL,
  `cardUsed` tinyint NOT NULL,
  `card` int DEFAULT NULL,
  `amount` double NOT NULL,
  `date` varchar(45) NOT NULL,
  `accountPayedTo` varchar(200) DEFAULT NULL,
  `accountRecievedFrom` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,14,NULL,'Deposit',1,16,100,'2023/11/19 15:38:36',NULL,NULL),(2,14,NULL,'Withdrawal',1,16,100,'2023/11/19 15:42:20',NULL,NULL),(3,14,NULL,'Withdrawal',1,16,100,'2023/11/19 15:44:28',NULL,NULL),(4,14,NULL,'Withdrawal',1,16,100,'2023/11/19 15:45:07',NULL,NULL),(5,14,NULL,'Withdrawal',1,16,100,'2023/11/19 15:45:17',NULL,NULL),(6,14,NULL,'Deposit',1,16,100,'2023/11/19 15:46:09',NULL,NULL),(7,14,NULL,'Deposit',1,16,100,'2023/11/19 15:46:09',NULL,NULL),(8,14,NULL,'Deposit',1,16,100,'2023/11/19 15:46:10',NULL,NULL),(9,14,NULL,'Deposit',1,16,100,'2023/11/19 15:46:11',NULL,NULL),(10,14,16,'UserToUser',0,NULL,10,'2023/11/19 15:55:15',NULL,NULL),(11,14,16,'UserToUser',0,NULL,10,'2023/11/19 16:01:49',NULL,NULL),(12,14,16,'UserToUser',0,NULL,10,'2023/11/19 16:02:24',NULL,NULL),(13,14,16,'CardToUser',1,16,10,'2023/11/19 16:02:41',NULL,NULL),(14,14,16,'CardToUser',1,16,10,'2023/11/19 16:02:59',NULL,NULL),(15,16,14,'UserToUser',0,NULL,10,'2023/11/19 16:10:11',NULL,NULL);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `name` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `balance` float NOT NULL,
  `twoFA` varchar(255) DEFAULT NULL,
  `card1` int DEFAULT NULL,
  `card2` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (14,'test1@email.com','testName1','$2b$08$mKu62h1ezQEgtdnNIOL9DuGqLBIab3JYS6/K1yIO29AIlw9z6pmPy',80,NULL,NULL,16),(16,'test2@email.com','testName2','$2b$08$dbBbDMuGduHGhuMQRImWCu4UHxoo7Yz/YlQTDrh66siPs79WZ/7Nq',40,NULL,NULL,NULL),(17,'test3@email.com','testName3','$2b$08$LSKV42CWOwjcKAgEmsh3dOm1Ds7tGg9FdUddjzzPYw2r8YpyEcJ.e',0,NULL,NULL,NULL),(19,'test4@email.com','testName4','$2b$08$Fqu59T3egNG1795beRoX0uV/LAY/rSCu./8WrfSkHDjOyiL6LlJ7m',0,NULL,NULL,NULL),(21,'test5@email.com','testName5','$2b$08$GgOP8lmVrwPu/VDP6sXnpe/y/3ppQOxSt/LQAgwRuXg2pH3qY.EEe',0,NULL,NULL,NULL),(22,'test6@email.com','testName6','$2b$08$fePznNzIUEmd0efhDaPCc.75niLs5dv5FskQEm.6iHgX2YlbfqMwK',0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-19 16:49:02
