yarn build
if($LASTEXITCODE -eq 0)
{
cd dist

cp index.html 404.html

git init .
git add -f .
git commit -m "Deploy"
git branch -M gh-pages
git remote add origin git@github.com:parami-protocol/apps.git
git push -f origin gh-pages
cd ..
}