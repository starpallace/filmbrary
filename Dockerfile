FROM python:3.9.16-alpine3.17

WORKDIR /film

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1



COPY ./requirements.txt .
RUN pip install -r requirements.txt


COPY . .