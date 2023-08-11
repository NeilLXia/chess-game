# update os & install python3 and libpq-dev for postgresql
sudo apt-get update
sudo apt-get install -y python3 python3-dev python3-pip python3-venv libpq-dev
pip install --user --upgrade virtualenv

# delete prior files
sudo rm -rf /home/ubuntu/chess-game