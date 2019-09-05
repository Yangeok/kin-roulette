#!/bin/bash

echo "--------------"
echo "<GET ROULETTE>"
echo "--------------"
echo -e "아이디:"
read ID

echo -e "비밀번호:"
read PW

ID=$ID PW=$PW node useRoulette.js 