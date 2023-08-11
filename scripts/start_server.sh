# kill existing processess
sudo pkill -f runserver

# setup virtual environment
echo "Y" | sudo apt install python3.10-venv
python3 -m venv venv
source venv/bin/activate

# install dependencies
cd /home/ubuntu/chess-game
echo "Y" | sudo apt install libcurl4-openssl-dev libssl-dev
sudo pip3 install -r requirements.txt

# run server
python3 manage.py makemigrations
python3 manage.py migrate
screen -d -m python3 manage.py runserver 0:8000