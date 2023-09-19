# kill existing processess
sudo pkill -f runserver

# setup virtual environment
cd
echo "Y" | sudo apt install python3.10-venv
python3 -m venv venv
source venv/bin/activate

# install dependencies
cd /home/ubuntu/chess-game
echo "Y" | sudo apt install libcurl4-openssl-dev libssl-dev
pip3 install -r requirements.txt

# run server
python3 server/manage.py makemigrations
python3 server/manage.py migrate
python3 server/manage.py livereload

screen -d -m -L python3 server/manage.py runserver 0.0.0.0:8000