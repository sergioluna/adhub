FROM python:3.9-alpine

WORKDIR /usr/src/backend

# prevents Python from writing pyc files to disc (python -B)
ENV PYTHONDONTWRITEBYTECODE 1
# prevents Python from buffering stdout and stderr (python -u)
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

COPY ./entrypoint.sh .

COPY . .

# run entrypoint.sh
ENTRYPOINT ["/usr/src/backend/entrypoint.sh"]