"""Test script for AI service endpoints."""

import asyncio
import httpx
import json

BASE_URL = "http://localhost:8000/api/ai"


async def test_chat():
    """Test chat endpoint."""
    print("\n📝 Testing Chat Endpoint...")
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/chat",
            json={
                "message": "How can I optimize a React component for performance?",
                "stream": False,
            },
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")


async def test_debug():
    """Test debug endpoint."""
    print("\n🐛 Testing Debug Endpoint...")
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/debug",
            json={
                "code": "const obj = null; console.log(obj.property);",
                "language": "typescript",
                "error": "Cannot read property 'property' of null",
                "stream": False,
            },
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")


async def test_review():
    """Test review endpoint."""
    print("\n🔍 Testing Review Endpoint...")
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{BASE_URL}/review",
            json={
                "code": "function add(a, b) { return a + b; }",
                "language": "typescript",
                "focus_areas": ["performance", "security"],
                "stream": False,
            },
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")


async def test_status():
    """Test status endpoint."""
    print("\n✅ Testing Status Endpoint...")
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/status")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")


async def test_health():
    """Test health check endpoint."""
    print("\n❤️  Testing Health Check...")
    async with httpx.AsyncClient() as client:
        response = await client.get("http://localhost:8000/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")


async def main():
    """Run all tests."""
    print("=" * 50)
    print("AI Coding Assistant - Backend Tests")
    print("=" * 50)

    try:
        await test_health()
        await test_status()
        await test_chat()
        await test_debug()
        await test_review()
        print("\n✨ All tests completed!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Make sure the backend is running: python -m uvicorn main:app --reload")


if __name__ == "__main__":
    asyncio.run(main())
