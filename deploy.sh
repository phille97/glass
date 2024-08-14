set -xe

npm run build

rsync -av dist/ root@insaneo.se:/opt/pocketbase/pb_public/