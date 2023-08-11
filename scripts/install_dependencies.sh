cd /home/ubuntu/chess-game
echo "Y" | sudo apt install libcurl4-openssl-dev libssl-dev
sudo pip3 install -r requirements.txt -t dependencies/
pip3 install django