import httpx

class HTTPHandler:
    _instance = None

    def __init__(self):
        self.client = httpx.AsyncClient()

    @staticmethod
    def get_instance():
        """
        Get the instance of the HTTP client.
        """
        if HTTPHandler._instance is None:
            HTTPHandler._instance = HTTPHandler()
        return HTTPHandler._instance.client

    async def post(self, url: str, data: dict) -> dict:
        """
        Post a request to a URL.
        Args:
            url (str): The URL to post to.
            data (dict): The data to post.
        """
        response = await self.client.post(url, json=data)
        return response.json()

    async def get(self, url: str) -> dict:
        """
        Get a request from a URL.
        Args:
            url (str): The URL to get from.
        """
        response = await self.client.get(url)
        return response.json()  
    
    async def put(self, url: str, data: dict) -> dict:
        """
        Put a request to a URL.
        Args:
            url (str): The URL to put to.
            data (dict): The data to put.
        """
        response = await self.client.put(url, json=data)
        return response.json()
    
    async def delete(self, url: str) -> dict:  
        """
        Delete a request from a URL.
        Args:
            url (str): The URL to delete from.
        """
        response = await self.client.delete(url)
        return response.json()

    