<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\HttpClient\HttpClientInterface;

class LuckyController extends AbstractController
{
    private $httpClient;

    public function __construct(HttpClientInterface $httpClient)
    {
        $this->httpClient = $httpClient;
    }

    #[Route("/words", name: "words_stream", methods: ["GET"])]
    public function streamWords(): Response
    {
        $callback = function () {
            // recup des données
            $response = $this->httpClient->request('GET', 'http://localhost:5000/stream');
            $content = $response->getContent();
            
            // split des données
            $words = preg_split('/\s+/', $content);

            // stream
            foreach ($words as $word) {
                if (!empty(trim($word))) {
                    echo "data: " . trim($word) . "\n\n";
                    ob_flush();
                    flush();
                    usleep(55000); 
                }
            }

            echo "data: EOF\n\n";
            ob_flush();
            flush();
        };

        $response = new StreamedResponse($callback);
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('Access-Control-Allow-Origin', '*');

        return $response;
    }
}
