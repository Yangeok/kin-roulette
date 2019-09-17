#!/bin/bash

echo ""
echo "--------------------"
echo "<NAVER KIN ROULETTE>"
echo "--------------------"
echo ""
echo -n "> Username: "
read ID
echo ""
unset PW
unset CHARCOUNT
echo -n "> Password: "
stty -echo
CHARCOUNT=0
while IFS= read -p "$PROMPT" -r -s -n 1 CHAR
do
    # Enter - accept password
    if [[ $CHAR == $'\0' ]] ; then
        break
    fi
    # Backspace
    if [[ $CHAR == $'\177' ]] ; then
        if [ $CHARCOUNT -gt 0 ] ; then
            CHARCOUNT=$((CHARCOUNT-1))
            PROMPT=$'\b \b'
            PW="${PW%?}"
        else
            PROMPT=''
        fi
    else
        CHARCOUNT=$((CHARCOUNT+1))
        PROMPT='*'
        PW+="$CHAR"
    fi
done
stty echo
echo ""
# echo "> Have a choice"
# echo -n "( 1: Get roulettes / 2: Use roulettes ): "

# read ENV
# if [ $ENV -eq  1 ]
# then
#   ID=$ID PW=$PW node getRoulette.js 
# elif [ $ENV -eq 2 ]
# then
#   ID=$ID PW=$PW node useRoulette.js 
# fi
echo ""
echo "> Get roulettes"
ID=$ID PW=$PW node getRoulette.js

echo "> Use roulettes"
ID=$ID PW=$PW node useRoulette.js

echo ""
function pause(){
  read -p "$*"
}
pause '> Press enter key...'