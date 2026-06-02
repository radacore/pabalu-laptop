#!/bin/bash

# Start both PHP Artisan server and Vite dev server concurrently
# Press Ctrl+C to stop both

echo "Starting PHP Artisan server..."
php artisan serve &
ARTISAN_PID=$!

echo "Starting Vite dev server..."
npm run dev &
VITE_PID=$!

cleanup() {
    echo ""
    echo "Stopping all processes..."
    kill $ARTISAN_PID 2>/dev/null
    kill $VITE_PID 2>/dev/null
    wait $ARTISAN_PID 2>/dev/null
    wait $VITE_PID 2>/dev/null
    echo "All processes stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

echo ""
echo "PHP Artisan running on http://localhost:8000"
echo "Vite dev server running"
echo "Press Ctrl+C to stop both."
echo ""

wait
