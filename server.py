import http.server
import socketserver

PORT = 9000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='.', **kwargs)

# Adiciona o MIME type para arquivos .js de forma compatível
MyHandler.extensions_map['.js'] = 'application/javascript'

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"Servidor iniciado em http://localhost:{PORT}")
    httpd.serve_forever()
