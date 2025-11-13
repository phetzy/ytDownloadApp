#!/bin/bash

# YouTube Downloader - Quick Deployment Script
# This script helps you deploy to both Railway and Vercel

echo "🚀 YouTube Downloader Deployment Helper"
echo "======================================="
echo ""

# Check if git repo is clean
if [[ -n $(git status -s) ]]; then
    echo "⚠️  You have uncommitted changes. Please commit them first:"
    echo ""
    git status -s
    echo ""
    read -p "Commit changes now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        git push origin main
        echo "✅ Changes committed and pushed!"
    else
        echo "❌ Deployment cancelled. Please commit your changes first."
        exit 1
    fi
else
    echo "✅ Git repository is clean"
fi

echo ""
echo "📋 Deployment Checklist:"
echo ""
echo "1. ✅ Code pushed to GitHub"
echo ""
echo "2. Railway Worker Deployment:"
echo "   - Go to https://railway.app"
echo "   - Create new project from your GitHub repo"
echo "   - Set root directory to: worker/"
echo "   - Generate public domain"
echo "   - Copy the worker URL"
echo ""
echo "3. Vercel Frontend Deployment:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repo"
echo "   - Add environment variable:"
echo "     Name: WORKER_SERVICE_URL"
echo "     Value: [Your Railway worker URL]"
echo "   - Deploy!"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT.md"
echo ""
echo "🎉 Happy deploying!"
