import numpy as np
import json
import random
import csv
import dataTool, modelSetting
import dataTool
import tensorflow as tf
import numpy as np
import json

y = None
with open('data/source/' + 'des1' + '.json') as json_file:
    y = json.load(json_file)

x = np.array([1])
y = np.array([y])

mean = np.mean(y)
std = np.std(y)
y = (y - mean) / std

input = tf.constant([[1.0]])
weight1 = tf.Variable(tf.random_normal(shape=[1, 32], mean=0, stddev=1), name='weight')
bias1 = tf.Variable(tf.random_normal(shape=[32], mean=0, stddev=1), name='bias')
l1 = tf.nn.relu(tf.matmul(input, weight1) + bias1)

weight2 = tf.Variable(tf.random_normal(shape=[32, 32], mean=0, stddev=1), name='weight')
bias2 = tf.Variable(tf.random_normal(shape=[32], mean=0, stddev=1), name='bias')
l2 = tf.nn.relu(tf.matmul(l1, weight2) + bias2)

weight3 = tf.Variable(tf.random_normal(shape=[32, 380 * 168], mean=0, stddev=1), name='weight')
bias3 = tf.Variable(tf.random_normal(shape=[380 * 168], mean=0, stddev=1), name='bias')
prediction = tf.matmul(l1, weight3) + bias3

loss = tf.reduce_mean(tf.reduce_sum(tf.square(y.flatten() - prediction), reduction_indices=[1]))

train_step = tf.train.AdamOptimizer(0.1).minimize(loss)



writer = tf.summary.FileWriter('./logs/with-bias-2l-norelu-2', tf.get_default_graph())
tf.summary.scalar("loss", loss)
tf.summary.histogram("weight1", weight1)
tf.summary.histogram("bias1", bias1)
tf.summary.histogram("weight2", weight2)
tf.summary.histogram("bias2", bias2)
tf.summary.histogram("weight3", weight3)
tf.summary.histogram("bias3", bias3)
summary_op = tf.summary.merge_all()


with tf.Session() as sess:
    sess.run(tf.global_variables_initializer())

    for i in range(250):
        _, ls, summary_str = sess.run([train_step, loss, summary_op])
        print(ls / (380 * 138))
        writer.add_summary(summary_str, i)

    predict = sess.run(prediction)
    predict = np.around(predict * std + mean)
    y_temp = y.flatten() * std + mean
    diff = np.abs(predict - y_temp)
    max_sum = y_temp.sum() if y_temp.sum() > predict.sum() else predict.sum()
    print('ARE: ', diff.sum() / max_sum)



