import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer


class MoveRecorderConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_name = 1  # self.scope['url_route']['game_id']
        self.group_name = "game_%s" % (self.game_name)

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        asyncio.sleep(10)
        await self.send({
            'type': 'websocket_close'
        })

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_layer)

    async def receive(self, data):
        data_json = json.loads(data)
        game_id = data_json['game_id']
        newNode = data_json['newNode']
        print(game_id, newNode)

        await self.channel_layer.group_send(self.group_name, {
            'type': 'move_data',
            'game_id': game_id,
            'newNode': newNode,
        })

    async def moveData(self, event):
        game_id = event['game_id']
        newNode = event['newNode']

        await self.send(text_data=json.dumps({'game_id': game_id,
                                              'newNode': newNode, }))

    pass
