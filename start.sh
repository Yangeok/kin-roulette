#!/bin/bash

echo ""
echo "--------------------"
echo "<NAVER KIN ROULETTE>"
echo "--------------------"
echo ""
echo -n "> Username: "
read ID
echo ""
echo -n "> Password: "
stty -echo
read PW
stty echo
echo ""
echo ""
echo "> Have a choice"
echo -n "( 1: Get roulettes / 2: Use roulettes ): "

read ENV
if [ $ENV -eq  1 ]
then
  ID=$ID PW=$PW node getRoulette.js 
elif [ $ENV -eq 2 ]
then
  ID=$ID PW=$PW node useRoulette.js 
fi