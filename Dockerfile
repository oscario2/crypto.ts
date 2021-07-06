FROM denoland/deno:1.11.2

RUN apt-get update && apt-get install make

WORKDIR /packages

USER deno

# these steps will be re-run upon each file change in your working directory:
ADD . .

# rn
CMD ["make", "all"]