#!/bin/bash

echo "--------------"
echo "<GET ROULETTE>"
echo "--------------"
echo -e "아이디:"
read ID

echo -n "비밀번호: "
stty -echo
read PW
stty echo

ID=$ID PW=$PW node useRoulette.js 